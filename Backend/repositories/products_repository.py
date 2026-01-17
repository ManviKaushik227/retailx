from extensions import mongo
from bson import ObjectId

def format_product(p):
    if not p:
        return None

    return {
        "id": str(p.get("_id")),
        "name": p.get("name"),
        "description": p.get("description"),
        "category": p.get("category"),
        "subCategory": p.get("subCategory"),
        "brand": p.get("brand"),
        "price": p.get("price"),
        "discount": p.get("discount", 0),
        "finalPrice": p.get("finalPrice"),
        "stock": p.get("stock", 0),
        "rating": p.get("rating", 0),
        "reviewsCount": p.get("reviewsCount", 0),
        "imageURL": p.get("imageURL") or (
            p.get("images", [""])[0] if p.get("images") else ""
        ),
        "tags": p.get("tags", []),
        "isActive": p.get("isActive", True),
        "highlights": p.get("highlights", []),
        "specs": p.get("specs", {}),
        "aiMetadata": p.get("aiMetadata", {}),
        "images": p.get("images", [])
    }


def get_all_products():
    products = mongo.db.products.find({"isActive": True})
    return [format_product(p) for p in products]


def get_product_by_id(product_id):
    product = mongo.db.products.find_one({"_id": ObjectId(product_id)})
    return format_product(product)



def get_products_by_category(category_name):
    if not category_name:
        return []

    # Case-insensitive search: 'Electronics' aur 'electronics' dono chalenge
    query = {
        "category": {"$regex": f"^{category_name}$", "$options": "i"},
        "isActive": True
    }
    
    products_cursor = mongo.db.products.find(query)
    return [format_product(p) for p in products_cursor]