from flask import Blueprint, jsonify
from database import products_collection

products_bp = Blueprint("products", __name__, url_prefix="/api/products")


@products_bp.route("/category/<category_name>", methods=["GET"])
def get_products_by_category(category_name):

    products = list(products_collection.find(
        {
            "category": category_name.lower(),
            "isActive": True
        },
        {"_id": 0}
    ))

    return jsonify(products), 200