from werkzeug.security import generate_password_hash, check_password_hash

def create_seller(email, password, storeName, registrationId):
    return {
        "email": email,
        "password": generate_password_hash(password),
        "storeName": storeName,
        "registrationId": registrationId,
        "role": "seller"
    }

def verify_password(stored_password, provided_password):
    return check_password_hash(stored_password, provided_password)