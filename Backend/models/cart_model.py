from extensions import mongo
from datetime import datetime
from bson import ObjectId

class Cart:
    @staticmethod
    def find_by_user(user_id):
        """User ka cart dhundne ke liye"""
        return mongo.db.carts.find_one({"userId": ObjectId(user_id)})

    @staticmethod
    def create_cart(user_id, monthly_budget=2000):
        """Naya cart banane ke liye (default budget ₹2000)"""
        return mongo.db.carts.insert_one({
            "userId": ObjectId(user_id),
            "items": [],
            "monthlyBudget": monthly_budget,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        })

    @staticmethod
    def add_item(user_id, product_data):
        """Metadata ke saath item add karega taaki refresh pe info na jaye"""
        cart = Cart.find_by_user(user_id)
        if not cart:
            Cart.create_cart(user_id)
            cart = Cart.find_by_user(user_id)

        # Extract info from product_data (Frontend se jo object aayega)
        product_id = product_data.get("productId")
        price = product_data.get("price")
        quantity = product_data.get("quantity", 1)

        # --- BUDGET VALIDATION ---
        current_spent = sum(item["price"] * item["quantity"] for item in cart.get("items", []))
        new_item_total = price * quantity
        budget_limit = cart.get("monthlyBudget", 2000)

        if current_spent + new_item_total > budget_limit:
            return {"error": f"Budget Full! Limit: ₹{budget_limit}"}, 400
        # -------------------------

        # Check if product already in cart
        found = False
        for item in cart["items"]:
            if item["productId"] == product_id:
                item["quantity"] += quantity
                found = True
                break
        
        if not found:
            # ✅ Sab kuch save karo: name, image, brand, category
            cart["items"].append({
                "productId": product_id,
                "name": product_data.get("name"),
                "price": price,
                "imageURL": product_data.get("imageURL"),
                "brand": product_data.get("brand"),
                "category": product_data.get("category"),
                "quantity": quantity
            })

        # Database update (items list update hogi, budget safe rahega)
        mongo.db.carts.update_one(
            {"userId": ObjectId(user_id)},
            {"$set": {"items": cart["items"], "updatedAt": datetime.utcnow()}}
        )
        return {"message": "Item added successfully"}, 200

    @staticmethod
    def remove_item(user_id, product_id):
        """$pull use karne se sirf item niklega, budget reset nahi hoga"""
        return mongo.db.carts.update_one(
            {"userId": ObjectId(user_id)},
            {"$pull": {"items": {"productId": product_id}}, 
             "$set": {"updatedAt": datetime.utcnow()}}
        )

    @staticmethod
    def update_budget(user_id, monthly_budget):
        """User apna budget yahan se change karega"""
        return mongo.db.carts.update_one(
            {"userId": ObjectId(user_id)},
            {"$set": {"monthlyBudget": monthly_budget, "updatedAt": datetime.utcnow()}}
        )

    @staticmethod
    def calculate_spent(cart):
        """Stats nikalne ke liye (Spent, Remaining, Percentage)"""
        if not cart: 
            return {"spent": 0, "remaining": 0, "percentUsed": 0, "monthlyBudget": 2000}
        
        budget = cart.get("monthlyBudget", 2000)
        spent = sum(item["price"] * item.get("quantity", 1) for item in cart.get("items", []))
        remaining = budget - spent
        percent_used = (spent / budget * 100) if budget > 0 else 0
        
        return {
            "spent": spent,
            "remaining": remaining,
            "percentUsed": round(percent_used, 2),
            "monthlyBudget": budget
        }