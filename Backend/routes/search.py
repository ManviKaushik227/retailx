from flask import Blueprint, jsonify, request

# ✅ Correct imports
from extensions import mongo
from repositories.products_repository import format_product

search_bp = Blueprint('search_bp', __name__)

@search_bp.route("", methods=["GET"])
def search_products():
    query = request.args.get('q', '').strip()

    if not query:
        return jsonify([])

    search_filter = {
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"brand": {"$regex": query, "$options": "i"}},
            {"category": {"$regex": query, "$options": "i"}},
            {"tags": {"$regex": query, "$options": "i"}}
        ]
    }

    products = list(
        mongo.db.products.find(search_filter)
    )

    result = [format_product(p) for p in products]
    return jsonify(result)
