from flask import Flask, request, jsonify
from archer import Archer, ArcherRegistry
from club import Club, ClubRegistry

app = Flask(__name__)

@app.route("/<club_name>/archer", methods=['POST'])
def create_account():
    data = request.get_json()
    print(f"Create account request: {data}")
    ArcherRegistry.add_account(Archer(data["name"], data["last_name"], data["birth_year"], data["gender"], data["email"], data["club_name"]))
    return jsonify({"message": "Account created"}), 201

@app.route("/<club_name>/archer/<email>/license_number", methods=['PUT'])
def add_license(email):
    data = request.get_json()
    print(f"Add license request: {data}")
    account = ClubRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_license(data["license_number"])
    return jsonify({"message": "License added"}), 200

@app.route("/<club_name>/archer/<email>/shots", methods=['PUT'])
def add_shots(email):
    data = request.get_json()
    print(f"Add shots request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_shots(data["name"], data["model"], data["tip_weight"], data["length"], data["hard"], data["parameter"], data["data_purchased"], data["quantity"])
    return jsonify({"message": "Shots added"}), 200

@app.route("/<club_name>/archer/<email>/chord", methods=['PUT'])
def add_chord(email):
    data = request.get_json()
    print(f"Add chord request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_chord(data["data_purchased"], data["quantity"])
    return jsonify({"message": "Chord added"}), 200

@app.route("/<club_name>/archer/<email>/training", methods=['PUT'])
def add_training(email):
    data = request.get_json()
    print(f"Add training request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_training(data["quantity_of_shots"], data["distance"])
    return jsonify({"message": "Training added"}), 200

@app.route("/<club_name>/archer/<email>/tournament", methods=['PUT'])
def add_tournament(email):
    data = request.get_json()
    print(f"Add tournament request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_tournament(data["distance"], data["score"])
    return jsonify({"message": "Tournament added"}), 200

@app.route("/<club_name>/archer/<email>", methods=['PUT'])
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
        if "club_name" in data:
            account.club_name = data["club_name"]
        if "shots" in data:
            account.shots = data["shots"]
        if "chord" in data:
            account.chord = data["chord"]
        return jsonify({"message": "Account updated"}), 200
    else:
        return jsonify({"message": "Account not found"}), 404
    
@app.route("/<club_name>/archer/<email>", methods=['DELETE'])
def delete_account(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    ArcherRegistry.accounts.remove(account)
    return jsonify({"message": "Account deleted"}), 200

@app.route("/<club_name>/archer/<email>/personal_data", methods=['GET'])
def get_account(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"name": account.name, "last_name": account.last_name, "birth_year": account.birth_year, "gender": account.gender, "email": account.email, "license_number": account.license_number}), 200

@app.route("/<club_name>/archer/<email>/equipment", methods=['GET'])
def get_equipment(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"shots": account.shots, "chord": account.chord}), 200

@app.route("/<club_name>/archer/<email>/trainings", methods=['GET'])
def get_trainings(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"trainings": account.trainings}), 200

@app.route("/<club_name>/archer/<email>/tournaments", methods=['GET'])
def get_tournaments(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"tournaments": account.tournaments}), 200

