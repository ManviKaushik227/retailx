from flask import Blueprint, request, jsonify
from models.cart_model import Cart
from bson import ObjectId
from datetime import datetime
from extensions import mongo

cart_bp = Blueprint("cart", __name__, url_prefix="/api/cart")

def handle_options():
    return jsonify({"status": "ok"}), 200

# Sabhi routes ke liye common response helper taaki frontend crash na ho
def get_cart_response(user_id):
    cart = Cart.find_by_user(user_id)
    if not cart:
        Cart.create_cart(user_id)
        cart = Cart.find_by_user(user_id)
    
    spent_data = Cart.calculate_spent(cart)
    return {
        "items": cart.get("items", []),
        "monthlyBudget": cart.get("monthlyBudget"), # Ab ye null ho sakta hai
        **spent_data
    }

@cart_bp.route("/", methods=["GET", "OPTIONS"])
def get_cart():
    if request.method == "OPTIONS": return handle_options()
    user_id = request.args.get("userId")
    if not user_id: return jsonify({"error": "userId required"}), 400
    
    try:
        return jsonify(get_cart_response(user_id))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cart_bp.route("/add", methods=["POST", "OPTIONS"])
def add_item():
    if request.method == "OPTIONS": return handle_options()
    data = request.json
    user_id = data.get("userId")
    
    res, status = Cart.add_item(user_id, data)
    if status != 200: return jsonify(res), status
    
    return jsonify(get_cart_response(user_id))

@cart_bp.route("/update", methods=["POST", "OPTIONS"])
def update_quantity():
    if request.method == "OPTIONS": return handle_options()
    data = request.json
    user_id = data.get("userId")
    
    # Model ki safety use karte huye update
    mongo.db.carts.update_one(
        {"userId": ObjectId(user_id), "items.productId": data.get("productId")},
        {"$set": {"items.$.quantity": data.get("quantity"), "updatedAt": datetime.utcnow()}}
    )
    
    return jsonify(get_cart_response(user_id))

@cart_bp.route("/remove", methods=["POST", "OPTIONS"])
def remove_item():
    if request.method == "OPTIONS": return handle_options()
    data = request.json
    user_id = data.get("userId")
    
    Cart.remove_item(user_id, data.get("productId"))
    return jsonify(get_cart_response(user_id))

@cart_bp.route("/budget", methods=["POST", "OPTIONS"])
def set_budget():
    if request.method == "OPTIONS": return handle_options()
    data = request.json
    user_id = data.get("userId")
    budget = data.get("monthlyBudget") # Frontend se null ya number aayega
    
    Cart.update_budget(user_id, budget)
    return jsonify(get_cart_response(user_id))

@cart_bp.route("/clear", methods=["POST", "OPTIONS"])
def clear_cart():
    if request.method == "OPTIONS": return handle_options()
    try:
        data = request.json
        user_id = data.get('userId')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        Cart.clear_cart(user_id)
        # Khali cart ka updated data bhejo taaki UI refresh ho jaye
        return jsonify({
            "message": "Cart cleared successfully",
            **get_cart_response(user_id)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500