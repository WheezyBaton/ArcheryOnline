from flask import Flask, request, jsonify
from archer import Archer, AccountsRegistry

app = Flask(__name__)

@app.route("/archer", methods=['POST'])
def create_account():
    data = request.get_json()
    print(f"Create account request: {data}")
    Archer.add_account(Archer(data["name"], data["last_name"], data["birth_year"], data["gender"], data["email"]))
    return jsonify({"message": "Account created"}), 201

@app.route("/archer/<email>/license_number", methods=['UPDATE'])
def add_license(email):
    data = request.get_json()
    print(f"Add license request: {data}")
    account = AccountsRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_license(data["license_number"])
    return jsonify({"message": "License added"}), 200

@app.route("/archer/<email>/shots", methods=['UPDATE'])
def add_shots(email):
    data = request.get_json()
    print(f"Add shots request: {data}")
    account = AccountsRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_shots(data["name"], data["model"], data["tip_weight"], data["length"], data["hard"], data["parameter"], data["data_purchased"], data["quantity"])
    return jsonify({"message": "Shots added"}), 200

@app.route("/archer/<email>/chord", methods=['UPDATE'])
def add_chord(email):
    data = request.get_json()
    print(f"Add chord request: {data}")
    account = AccountsRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_chord(data["data_purchased"], data["quantity"])
    return jsonify({"message": "Chord added"}), 200

@app.route("/archer/<email>/training", methods=['UPDATE'])
def add_training(email):
    data = request.get_json()
    print(f"Add training request: {data}")
    account = AccountsRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_training(data["quantity_of_shots"], data["distance"])
    return jsonify({"message": "Training added"}), 200

@app.route("/archer/<email>/tournament", methods=['UPDATE'])
def add_tournament(email):
    data = request.get_json()
    print(f"Add tournament request: {data}")
    account = AccountsRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_tournament(data["distance"], data["score"])
    return jsonify({"message": "Tournament added"}), 200

@app.route("/archer/<email>", methods=['UPDATE'])
def update_account(email):
    data = request.get_json()
    account = AccountsRegistry.find_account_by_email(email)
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
        if "shots" in data:
            account.shots = data["shots"]
        if "chord" in data:
            account.chord = data["chord"]
        return jsonify({"message": "Account updated"}), 200
    else:
        return jsonify({"message": "Account not found"}), 404