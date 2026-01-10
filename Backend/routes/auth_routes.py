from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
import pymongo
import os
import re
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI") or "mongodb://localhost:27017"
client = pymongo.MongoClient(MONGO_URI)
db = client["retailx"]
users_collection = db["users"]

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Password validation regex
PASSWORD_REGEX = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$')

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    if not PASSWORD_REGEX.match(password):
        return jsonify({
            "message": (
                "Password must be at least 8 characters long and contain "
                "uppercase, lowercase, and a special character"
            )
        }), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 409

    hashed_password = generate_password_hash(password)

    users_collection.insert_one({
        "email": email,
        "password": hashed_password,
        "preferences": []  # initialize empty preferences
    })

    access_token = create_access_token(identity=email)

    return jsonify({"message": "Registration successful", "token": access_token}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=email)

    return jsonify({"message": "Login successful", "token": access_token}), 200