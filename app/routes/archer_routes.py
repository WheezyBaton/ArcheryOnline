from flask import request, jsonify
from app import app
from app.models.archer import Archer, ArcherRegistry


@app.route("/archer/add", methods=['POST'])
def create_account():
    data = request.get_json()
    print(f"Create account request: {data}")
    ArcherRegistry.add_account(Archer(data["name"], data["last_name"], data["birth_year"], data["gender"], data["email"]))
    return jsonify({"message": "Account created"}), 201

@app.route("/archer/<email>/change/license_number", methods=['PUT'])
def add_license(email):
    data = request.get_json()
    print(f"Add license request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_license(data["license_number"])
    return jsonify({"message": "License added"}), 200

@app.route("/archer/<email>/change/shots", methods=['PUT'])
def add_shots(email):
    data = request.get_json()
    print(f"Add shots request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_shots(data["name"], data["model"], data["tip_weight"], data["length"], data["hard"], data["parameter"], data["data_purchased"], data["quantity"])
    return jsonify({"message": "Shots added"}), 200

@app.route("/archer/<email>/change/chord", methods=['PUT'])
def add_chord(email):
    data = request.get_json()
    print(f"Add chord request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_chord(data["data_purchased"], data["quantity"])
    return jsonify({"message": "Chord added"}), 200

@app.route("/archer/<email>/change", methods=['PUT'])
def update_account(email):
    data = request.get_json()
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    if account:
        if "name" in data:
            account.name = data["name"]
        if "last_name" in data:
            account.last_name = data["last_name"]
        if "birth_year" in data:
            account.birth_year = data["birth_year"]
        if "gender" in data:
            account.gender = data["gender"]
        if "email" in data:
            account.email = data["email"]
        if "license_number" in data:
            account.license_number = data["license_number"]
        return jsonify({"message": "Account updated"}), 200
    else:
        return jsonify({"message": "Account not found"}), 404
    
@app.route("/archer/<email>/delete", methods=['DELETE'])
def delete_account(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    ArcherRegistry.accounts.remove(account)
    return jsonify({"message": "Account deleted"}), 200

@app.route("/archer/<email>/personal_data", methods=['GET'])
def get_account(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"name": account.name, "last_name": account.last_name, "birth_year": account.birth_year, "gender": account.gender, "email": account.email, "license_number": account.license_number}), 200

@app.route("/archer/<email>/equipment", methods=['GET'])
def get_equipment(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"shots": account.shots, "chord": account.chord}), 200