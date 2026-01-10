
# import os
# from flask import Blueprint, request, jsonify
# from google import genai
# from config import products_collection # Central connection

# chat_bp = Blueprint('chat_bp', __name__)

# # AI Client
# client_ai = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# def get_products_from_db(query):
#     query = query.lower()
    
#     # Generic queries handle karne ke liye keywords
#     generic_keywords = ["what", "have", "items", "products", "list", "inventory", "show", "all", "beauty"]
    
#     # Agar broad query hai toh top products dikhao
#     if any(word in query for word in generic_keywords) or len(query) < 3:
#         results = list(products_collection.find({"isActive": True}).limit(8))
#     else:
#         # Smart Search: Name, Tags, Style (glowy/matte), aur Concern (pores/dry) sabme dhundega
#         search_query = {
#             "$or": [
#                 {"name": {"$regex": query, "$options": "i"}},
#                 {"tags": {"$regex": query, "$options": "i"}},
#                 {"category": {"$regex": query, "$options": "i"}},
#                 {"aiMetadata.style": {"$regex": query, "$options": "i"}},
#                 {"aiMetadata.concern": {"$regex": query, "$options": "i"}},
#                 {"subCategory": {"$regex": query, "$options": "i"}}
#             ]
#         }
#         results = list(products_collection.find(search_query).limit(5))
    
#     # Data formatting with your new Beauty fields
#     product_list = ""
#     for p in results:
#         product_list += (
#             f"- {p.get('name')} (Brand: {p.get('brand')})\n"
#             f"  Price: ₹{p.get('finalPrice')} | Rating: {p.get('rating')}⭐\n"
#             f"  Best for: {p.get('aiMetadata', {}).get('style', 'General')} styles and "
#             f"{p.get('aiMetadata', {}).get('concern', 'daily use')} concerns.\n"
#         )
    
#     return product_list if product_list else "No specific beauty products found for this query."

# @chat_bp.route('/chat', methods=['POST'])
# def chat_endpoint():
#     try:
#         data = request.json
#         user_message = data.get("message")
        
#         # Database fetch
#         context_data = get_products_from_db(user_message)

#         # Enhanced System Instruction
#         system_instruction = f"""
#         You are the 'RetailX Beauty Expert'. 
#         Current Inventory Info:
#         {context_data}

#         RULES:
#         1. Always suggest products only from the inventory above.
#         2. If the user asks about skin concerns (like oily skin or dark circles), match it with the 'Best for' info.
#         3. Keep the conversation friendly, helpful, and professional.
#         4. If a user asks 'what do you have', give a nice summary of the beauty products available.
#         """

#         response = client_ai.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=f"{system_instruction}\nUser: {user_message}"
#         )
        
#         return jsonify({"reply": response.text})
#     except Exception as e:
#         print(f"Chat Error: {e}")
#         return jsonify({"reply": "System busy hai, please try again."}), 500



import os
from flask import Blueprint, request, jsonify
from google import genai
from extensions import mongo   # ✅ single Mongo connection

chat_bp = Blueprint('chat_bp', __name__)

# AI Client
client_ai = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_products_from_db(query):
    query = query.lower()

    generic_keywords = [
        "what", "have", "items", "products",
        "list", "inventory", "show", "all", "beauty"
    ]

    # Broad / generic query → top products
    if any(word in query for word in generic_keywords) or len(query) < 3:
        results = list(
            mongo.db.products.find({"isActive": True}).limit(8)
        )
    else:
        search_query = {
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"tags": {"$regex": query, "$options": "i"}},
                {"category": {"$regex": query, "$options": "i"}},
                {"subCategory": {"$regex": query, "$options": "i"}},
                {"aiMetadata.style": {"$regex": query, "$options": "i"}},
                {"aiMetadata.concern": {"$regex": query, "$options": "i"}}
            ]
        }

        results = list(
            mongo.db.products.find(search_query).limit(5)
        )

    # Text context for Gemini (SAME logic)
    product_list = ""
    for p in results:
        product_list += (
            f"- {p.get('name')} (Brand: {p.get('brand')})\n"
            f"  Price: ₹{p.get('finalPrice')} | Rating: {p.get('rating')}⭐\n"
            f"  Best for: {p.get('aiMetadata', {}).get('style', 'General')} styles and "
            f"{p.get('aiMetadata', {}).get('concern', 'daily use')} concerns.\n"
        )

    return (
        product_list
        if product_list
        else "No specific beauty products found for this query."
    )


@chat_bp.route('/chat', methods=['POST'])
def chat_endpoint():
    try:
        data = request.json
        user_message = data.get("message", "")

        # Inventory context from DB
        context_data = get_products_from_db(user_message)

        system_instruction = f"""
You are the 'RetailX Beauty Expert'.

Current Inventory Info:
{context_data}

RULES:
1. Always suggest products only from the inventory above.
2. Match skin concerns with 'Best for' info.
3. Keep the tone friendly, helpful, and professional.
4. If user asks "what do you have", give a clean summary.
"""

        response = client_ai.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{system_instruction}\nUser: {user_message}"
        )

        return jsonify({"reply": response.text})

    except Exception as e:
        print("Chat Error:", e)
        return jsonify({
            "reply": "System busy hai, please try again."
        }), 500
