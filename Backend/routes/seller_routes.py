from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from extensions import mongo
from models.seller_model import create_seller, verify_password

seller_bp = Blueprint("seller", __name__)

# 🔐 REGISTER SELLER
@seller_bp.route("/api/seller/register", methods=["POST"])
def register_seller():
    data = request.json

    email = data.get("email")
    password = data.get("password")
    storeName = data.get("storeName")
    registrationId = data.get("registrationId")

    if not all([email, password, storeName, registrationId]):
        return jsonify({"message": "All fields required"}), 400

    if mongo.db.sellers.find_one({"email": email}):
        return jsonify({"message": "Seller already exists"}), 409

    seller = create_seller(email, password, storeName, registrationId)
    mongo.db.sellers.insert_one(seller)

    token = create_access_token(identity={
        "email": email,
        "role": "seller"
    })

    return jsonify({
        "message": "Seller registered successfully",
        "token": token
    }), 201


# 🔑 LOGIN SELLER
@seller_bp.route("/api/seller/login", methods=["POST"])
def login_seller():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    seller = mongo.db.sellers.find_one({"email": email})

    if not seller or not verify_password(seller["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity={
        "email": email,
        "role": "seller"
    })

    return jsonify({
        "message": "Login successful",
        "token": token
    }), 200