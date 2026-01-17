



import os
import re
import json
import traceback
from flask import Blueprint, request, jsonify
from google import genai
from extensions import mongo

chat_bp = Blueprint("chat_bp", __name__)

# =========================
# Gemini AI Client
# =========================
client_ai = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# ======================================================
# SAFE JSON EXTRACTOR
# ======================================================
def extract_json_from_text(text: str):
    try:
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            return None
        return json.loads(match.group())
    except Exception:
        return None

# ======================================================
# UPGRADED INTENT EXTRACTION
# ======================================================
def extract_intent_with_ai(user_message: str):
    intent = {
        "category": None,
        "max_price": None,
        "brand": None,
        "use_case": None
    }

    # RULE BASED PRICE (Fast & Reliable)
    price_match = re.search(
        r"(under|below|max|upto|up to|budget)\s*₹?\s*(\d+)",
        user_message.lower()
    )
    if price_match:
        intent["max_price"] = int(price_match.group(2))

    # AI ENHANCEMENT (Multi-Category Support)
    try:
        prompt = f"""
        Analyze this shopping query: "{user_message}"
        Identify:
        1. category (e.g., electronics, footwear, beauty, etc.)
        2. max_price (numeric only)
        3. brand
        4. use_case (e.g., gaming, wedding, office)

        Return ONLY a clean JSON object. If a field is unknown, use null.
        """

        response = client_ai.models.generate_content(
            model="gemini-2.0-flash", # Updated to stable version
            contents=prompt
        )

        ai_intent = extract_json_from_text(response.text)

        if ai_intent:
            for key in intent:
                # Sirf tab update karein agar AI ne value di ho aur rule-based ne pehle na dhunda ho
                if ai_intent.get(key) is not None:
                    intent[key] = ai_intent[key]

    except Exception as e:
        print("Intent AI Error:", e)

    return intent

# ======================================================
# DATABASE QUERY
# ======================================================
def get_products_from_db(intent: dict):
    try:
        query = {"isActive": True}

        if intent.get("category"):
            query["category"] = {"$regex": intent["category"], "$options": "i"}

        if intent.get("brand"):
            query["brand"] = {"$regex": intent["brand"], "$options": "i"}

        if intent.get("max_price"):
            query["finalPrice"] = {"$lte": int(intent["max_price"])}

        results = list(mongo.db.products.find(query).limit(5))

        if not results:
            return None # Khali inventory return karein

        context = ""
        for p in results:
            context += (
                f"- **{p.get('name')}** | Brand: {p.get('brand')}\n"
                f"  Price: ₹{p.get('finalPrice')} | Rating: {p.get('rating')}⭐\n"
                f"  Highlight: {p.get('aiMetadata', {}).get('use', 'Premium Quality')}\n\n"
            )
        return context

    except Exception as e:
        print("DB Fetch Error:", e)
        return "Error fetching product data."

# ======================================================
# CHAT ENDPOINT
# ======================================================
@chat_bp.route("/", methods=["POST", "OPTIONS"])
def chat_endpoint():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"reply": "Invalid request"}), 400

        user_message = data["message"].strip()

        # 1. Intent Nikalna
        intent = extract_intent_with_ai(user_message)

        # 2. Database se dhoondhna
        context_data = get_products_from_db(intent)

        # 3. Final Persona Based Response
        system_instruction = """
        You are the 'RetailX Universal Shopping Expert'. 
        Your knowledge spans across Electronics, Fashion, Beauty, Home Decor, and more.
        
        Rules:
        - NEVER identify as just a 'beauty' or 'laptop' expert. You are a complete store assistant.
        - If products are found: Present them professionally using bullet points.
        - If NO products are found: Politely say we don't have that specific item in stock right now, but offer to help find something else in our other departments.
        - Always use ₹ for currency and ⭐ for ratings.
        - Keep responses concise and friendly.
        """

        final_prompt = f"""
        {system_instruction}

        Context:
        - User Intent: {json.dumps(intent)}
        - Inventory Data: {context_data if context_data else 'No matching products found in database.'}

        User Query: {user_message}
        """

        response = client_ai.models.generate_content(
            model="gemini-2.5-flash",
            contents=final_prompt
        )

        return jsonify({"reply": response.text})

    except Exception:
        traceback.print_exc()
        return jsonify({"reply": "I'm having trouble connecting to my inventory. Please try again."}), 500