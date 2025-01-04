from flask import request, jsonify
from backend import app
from backend.models.trainer import TrainerRegistry, Trainer

@app.route("/trainer/add", methods=['POST'])
def create_account():
    data = request.get_json()
    print(f"Create account request: {data}")
    TrainerRegistry.add_account(Trainer(data["name"], data["last_name"], data["email"], data["phone_nuber"], data["license_number"]))
    return jsonify({"message": "Account created"}), 201

@app.route("/trainer/<email>/delete", methods=['DELETE'])
def delete_account(email):
    account = TrainerRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    TrainerRegistry.accounts.remove(account)
    return jsonify({"message": "Account deleted"}), 200

@app.route("/trainer/<email>/change", methods=['PUT'])
def update_account(email):
    data = request.get_json()
    account = TrainerRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    if account:
        if "name" in data:
            account.name = data["name"]
        if "last_name" in data:
            account.last_name = data["last_name"]
        if "email" in data:
            account.email = data["email"]
        if "phone_number" in data:
            account.phone_number = data["phone_number"]
        if "license_number" in data:
            account.license_number = data["license_number"]
        
        return jsonify({"message": "Account updated"}), 200
    else:
        return jsonify({"message": "Account not found"}), 404
    
@app.route("/trainer/<email>/personal_data", methods=['GET'])
def get_account(email):
    account = TrainerRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"name": account.name, "last_name": account.last_name, "email": account.email, "phone_number": account.phone_number, "license_number": account.license_number}), 200