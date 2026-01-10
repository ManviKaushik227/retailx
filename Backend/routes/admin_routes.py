from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from extensions import bcrypt
from models.admin_model import Admin
import os
import re

admin_bp = Blueprint("admin", __name__)

# 🔐 Strong password rule
def is_strong_password(password):
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True


# 📝 ADMIN REGISTER
@admin_bp.route("/register", methods=["POST"])
def register_admin():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    admin_key = data.get("adminKey")

    if not all([email, password, admin_key]):
        return jsonify({"message": "All fields required"}), 400

    # 🔐 Check admin secret
    if admin_key != os.getenv("ADMIN_SECRET_KEY"):
        return jsonify({"message": "Invalid Admin Secret Key"}), 403

    if not is_strong_password(password):
        return jsonify({
            "message": "Password must be 8+ chars with upper, lower, number & special"
        }), 400

    if Admin.find_by_email(email):
        return jsonify({"message": "Admin already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    Admin.create_admin(email, hashed_pw)

    token = create_access_token(identity={"email": email, "role": "admin"})
    return jsonify({"token": token, "message": "Admin registered"}), 201


# 🔓 ADMIN LOGIN
@admin_bp.route("/login", methods=["POST"])
def login_admin():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    admin = Admin.find_by_email(email)
    if not admin:
        return jsonify({"message": "Invalid credentials"}), 401

    if not bcrypt.check_password_hash(admin["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity={"email": email, "role": "admin"})
    return jsonify({"token": token, "message": "Admin login success"}), 200