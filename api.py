from flask import Flask, request, jsonify
from archer import Archer, ArcherRegistry
from club import Club, ClubRegistry

app = Flask(__name__)

@app.route("/archer", methods=['POST'])
def create_account():
    data = request.get_json()
    print(f"Create account request: {data}")
    ArcherRegistry.add_account(Archer(data["name"], data["last_name"], data["birth_year"], data["gender"], data["email"]))
    return jsonify({"message": "Account created"}), 201

@app.route("/archer/<email>/license_number", methods=['PUT'])
def add_license(email):
    data = request.get_json()
    print(f"Add license request: {data}")
    account = ClubRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_license(data["license_number"])
    return jsonify({"message": "License added"}), 200

@app.route("/archer/<email>/shots", methods=['PUT'])
def add_shots(email):
    data = request.get_json()
    print(f"Add shots request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_shots(data["name"], data["model"], data["tip_weight"], data["length"], data["hard"], data["parameter"], data["data_purchased"], data["quantity"])
    return jsonify({"message": "Shots added"}), 200

@app.route("/archer/<email>/chord", methods=['PUT'])
def add_chord(email):
    data = request.get_json()
    print(f"Add chord request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_chord(data["data_purchased"], data["quantity"])
    return jsonify({"message": "Chord added"}), 200

@app.route("/archer/<email>/training", methods=['PUT'])
def add_training(email):
    data = request.get_json()
    print(f"Add training request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_training(data["quantity_of_shots"], data["distance"])
    return jsonify({"message": "Training added"}), 200

@app.route("/archer/<email>/tournament", methods=['PUT'])
def add_tournament(email):
    data = request.get_json()
    print(f"Add tournament request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_tournament(data["distance"], data["score"])
    return jsonify({"message": "Tournament added"}), 200

@app.route("/archer/<email>", methods=['PUT'])
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
    
@app.route("/archer/<email>", methods=['DELETE'])
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

@app.route("/archer/<email>/trainings", methods=['GET'])
def get_trainings(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"trainings": account.trainings}), 200

@app.route("/archer/<email>/tournaments", methods=['GET'])
def get_tournaments(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"tournaments": account.tournaments}), 200

@app.route("/archer/<email>/assign", methods=['POST'])
def assign_archer_to_club(club_name, email):
    club = next((c for c in ClubRegistry.clubs if c.name == club_name), None)
    if not club:
        return jsonify({"message": f"Club {club_name} not found"}), 404

    archer = ArcherRegistry.find_account_by_email(email)
    if not archer:
        return jsonify({"message": f"Archer with email {email} not found"}), 404

    for other_club in ClubRegistry.clubs:
        if archer in other_club.archers:
            if other_club == club:
                return jsonify({"message": "Archer is already a member of this club"}), 400
            else:
                return jsonify({
                    "message": f"Archer {archer.name} {archer.last_name} is already a member of another club ({other_club.name})"
                }), 400

    club.archers.append(archer)
    return jsonify({"message": f"Archer {archer.name} {archer.last_name} assigned to club {club_name}"}), 200

@app.route("/archer/<email>/equipment/wear", methods=['PATCH'])
def update_equipment_wear(club_name, email):
    data = request.get_json()

    new_shots = data.get("new_shots")
    if new_shots is None or not isinstance(new_shots, int) or new_shots <= 0:
        return jsonify({"message": "Invalid number of new shots provided"}), 400

    archer = ArcherRegistry.find_account_by_email(email)
    if not archer:
        return jsonify({"message": f"Archer with email {email} not found"}), 404

    if archer.shots:
        archer.shots[-1] += new_shots
    else:
        return jsonify({"message": "Archer does not have a set of arrows assigned"}), 400

    if archer.chord:
        archer.chord[-1] += new_shots
    else:
        return jsonify({"message": "Archer does not have a bowstring assigned"}), 400

    return jsonify({
        "message": "Equipment wear updated",
        "arrows_wear": archer.shots[-1],
        "chord_wear": archer.chord[-1],
    }), 200

@app.route("/archer/<email>/tournament/indoor", methods=['POST'])
def add_indoor_tournament(email):

    data = request.get_json()
    distance = data.get("distance")
    series = data.get("series")

    if distance is None or not isinstance(distance, (int, float)) or distance <= 0:
        return jsonify({"message": "Invalid or missing distance"}), 400

    if not series or not isinstance(series, list) or len(series) != 10:
        return jsonify({"message": "Invalid or missing series data. Must be a list of 10 series"}), 400

    for s in series:
        if not isinstance(s, list) or len(s) != 3 or not all(isinstance(score, int) and 0 <= score <= 10 for score in s):
            return jsonify({"message": "Each series must contain exactly 3 scores (integers between 0 and 10)"}), 400

    archer = ArcherRegistry.find_account_by_email(email)
    if not archer:
        return jsonify({"message": f"Archer with email {email} not found"}), 404

    total_score = sum(sum(s) for s in series)
    tournament = {
        "type": "indoor",
        "distance": distance,
        "total_score": total_score,
        "series": series
    }
    archer.tournaments.append(tournament)
    return jsonify({"message": "Indoor tournament added", "tournament": tournament}), 201