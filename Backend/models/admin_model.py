from extensions import mongo

class Admin:
    @staticmethod
    def find_by_email(email):
        return mongo.db.admins.find_one({"email": email})

    @staticmethod
    def create_admin(email, password):
        return mongo.db.admins.insert_one({
            "email": email,
            "password": password,
            "role": "admin"
        })