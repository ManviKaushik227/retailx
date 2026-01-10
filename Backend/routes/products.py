from flask import Blueprint, jsonify, request
from bson import ObjectId

from repositories.products_repository import format_product
from extensions import mongo

product_bp = Blueprint('product_bp', __name__)

# ✅ Get Single Product
@product_bp.route("/<id>", methods=["GET"])
def get_single_product(id):
    try:
        product = mongo.db.products.find_one({"_id": ObjectId(id)})
        if product:
            return jsonify(format_product(product))
        return jsonify({"error": "Product not found"}), 404
    except Exception:
        return jsonify({"error": "Invalid ID format"}), 400


# ✅ Get Products (category / exclude / limit)
@product_bp.route("/", methods=["GET"])
def get_products():
    category_name = request.args.get('category')
    limit = int(request.args.get('limit', 20))
    exclude_id = request.args.get('exclude')

    query = {}

    if category_name:
        query["category"] = {"$regex": f"^{category_name}$", "$options": "i"}

    if exclude_id:
        try:
            query["_id"] = {"$ne": ObjectId(exclude_id)}
        except Exception:
            pass

    products = list(
        mongo.db.products.find(query).limit(limit)
    )

    return jsonify([format_product(p) for p in products])
