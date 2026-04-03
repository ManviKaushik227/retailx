from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import mongo
from models.order_model import Order
from models.user_model import User
from bson.objectid import ObjectId # Zaroori: ObjectId conversion ke liye
import os
import stripe
from datetime import datetime
from utils.email_utils import send_order_email  # <--- Ye line add kar

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

@orders_bp.route("/create", methods=["POST"])
@jwt_required()
def create_order():
    try:
        email = get_jwt_identity()
        data = request.get_json()

        session_id = data.get("session_id")
        address = data.get("address")
        items = data.get("items")
        total = data.get("total")

        if not session_id:
            return jsonify({"error": "No session ID provided"}), 400

        # Initialize Stripe
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

        # Retrieve session
        session = stripe.checkout.Session.retrieve(session_id)
        payment_id = session.payment_intent 

        # Prevent duplicate orders
        existing_order = mongo.db.orders.find_one({"payment_id": payment_id})
        if existing_order:
            return jsonify({"message": "Order already recorded", "order_id": str(existing_order["_id"])}), 200

        # 1. Fetch User to get their ObjectId
        user_info = mongo.db.users.find_one({"email": email})
        if not user_info:
            return jsonify({"error": "User not found in database"}), 404
        
        actual_user_id = user_info["_id"] # Ye already ObjectId format mein hai

        # 2. Save order to DB
        result = Order.create_order(
            email=email,
            items=items,
            total=float(total),
            address_details=address,
            payment_id=payment_id,
            created_at=datetime.utcnow()
        )

        
        # ======================================================
        # ✅ CHECK: MAIL BHEJNE KA SYSTEM WITH LOGS
        # ======================================================
        if result.inserted_id:
            print(f"--- Attempting to send email to: {email} ---")
            try:
                # Pehle product ka naam nikaalna
                p_name = items[0].get("name", "Exclusive Item") if items else "Order"
                
                # Email bhejne ki koshish
                mail_status = send_order_email(email, p_name, total)
                
                if mail_status:
                    print(f"🚀 SUCCESS: Email successfully sent to {email}")
                else:
                    print(f"⚠️ WARNING: send_order_email returned False")

            except Exception as mail_err:
                # Agar App Password galat hai ya net nahi hai toh yahan pakda jayega
                print(f"❌ MAIL ERROR: Kuch toh gadbad hai! Details: {str(mail_err)}")
        # ======================================================




        # 3. Update user's profile with latest contact/address
        User.save_contact_and_address(
            email=email,
            contact={
                "email": address.get("email"),
                "phone": address.get("phone")
            },
            address=address
        )
       





        # ======================================================
        # NEW: BUDGET UPDATE & CART CLEARING (using ObjectId)
        # ======================================================
        # Hum actual_user_id use kar rahe hain jo ki ObjectId hai.
        # $inc budget se amount minus karega aur $set items ko empty array kar dega.
        mongo.db.carts.update_one(
            {"userId": actual_user_id}, 
            {
                "$inc": {"spent": float(total)}, 
                "$set": {"items": []}
            }
        )
        # ======================================================

        return jsonify({
            "message": "Order saved successfully and budget updated",
            "order_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        print(f"Backend Error: {str(e)}") # Critical for debugging
        return jsonify({"error": str(e)}), 500