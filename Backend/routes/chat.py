import os
import traceback # Error detail dekhne ke liye
from flask import Blueprint, request, jsonify
from google import genai
from extensions import mongo

chat_bp = Blueprint('chat_bp', __name__)

# AI Client
client_ai = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_products_from_db(query):
    try:
        query = query.lower() if query else ""
        generic_keywords = ["what", "have", "items", "products", "list", "inventory", "show", "all", "beauty"]

        if any(word in query for word in generic_keywords) or len(query) < 3:
            results = list(mongo.db.products.find({"isActive": True}).limit(8))
        else:
            search_query = {
                "$or": [
                    {"name": {"$regex": query, "$options": "i"}},
                    {"tags": {"$regex": query, "$options": "i"}},
                    {"category": {"$regex": query, "$options": "i"}},
                    {"aiMetadata.style": {"$regex": query, "$options": "i"}},
                    {"aiMetadata.concern": {"$regex": query, "$options": "i"}}
                ]
            }
            results = list(mongo.db.products.find(search_query).limit(5))

        product_list = ""
        for p in results:
            product_list += (
                f"- {p.get('name')} (Brand: {p.get('brand')})\n"
                f"  Price: ₹{p.get('finalPrice')} | Rating: {p.get('rating')}⭐\n"
                f"  Best for: {p.get('aiMetadata', {}).get('style', 'General')} styles and "
                f"{p.get('aiMetadata', {}).get('concern', 'daily use')} concerns.\n"
            )
        print("Checking DB:", mongo.db.name, "Collection:", mongo.db.products.count_documents({}))
        return product_list if product_list else "No specific beauty products found."
    except Exception as e:
        print("DB Fetch Error:", e)
        return "Error fetching products."

@chat_bp.route('/', methods=['POST', 'OPTIONS']) # Slash change kiya yahan
def chat_endpoint():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"reply": "Bhai, request body empty hai!"}), 400
            
        user_message = data.get("message", "")
        context_data = get_products_from_db(user_message)

        

        system_instruction = f"""
You are the 'RetailX Beauty Expert' ✨.

Current Inventory:
{context_data}

STYLE RULES:
1. **Formatting**: Use Markdown to make the response look beautiful.
   - Use **bold** for product names.
   - Use bullet points for features.
   - Use `₹` for pricing.
   - Use ⭐ for ratings.
2. **Structure**:
   - Start with a friendly greeting if it's the beginning of a chat.
   - Group suggestions clearly.
   - If recommending multiple products, use a clean list.
3. **Tone**: Be helpful, like a high-end beauty consultant.
4. **Call to Action**: End with a helpful question (e.g., "Would you like more details on any of these?").

Example Output Style:
"I found some perfect matches for you! ✨

1. **[Product Name]** - 💰 Price: ₹999 
   - ⭐ Rating: 4.5/5
   - 🌸 Best for: [Concern]"
"""

        # Gemini 2.5 Flash call
        response = client_ai.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{system_instruction}\nUser: {user_message}"
        )

        return jsonify({"reply": response.text})

    except Exception as e:
        # Ye line terminal mein bata degi ki EXACTLY kaunsi line phat rahi hai
        print("-" * 30)
        traceback.print_exc() 
        print("-" * 30)
        return jsonify({"reply": "System busy hai, terminal check karo."}), 500