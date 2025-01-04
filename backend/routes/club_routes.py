from flask import jsonify, request
from backend import app
from backend.models.club import ClubRegistry, Club
from backend.models.archer import ArcherRegistry
from backend.models.trainer import TrainerRegistry

@app.route("/club/add", methods=['POST'])
def create_club():
    data = request.get_json()
    print(f"Create club request: {data}")
    ClubRegistry.add_club(Club(data["name"], data["adress"], data["phone_number"], data["email"]))
    return jsonify({"message": "Club created"}), 201

@app.route("/club/<name>/delete", methods=['DELETE'])
def delete_club(name):
    club = ClubRegistry.find_club_by_name(name)
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    ClubRegistry.clubs.remove(club)
    return jsonify({"message": "Club deleted"}), 200

@app.route("/club/<name>", methods=['GET'])
def get_club(name):
    club = ClubRegistry.find_club_by_name(name)
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    return jsonify({"name": club.name, "adress": club.address, "phone_number": club.phone_number, "email": club.email}), 200

@app.route("/club/<name>/archers", methods=['GET'])
def get_archers_from_club(name):
    club = ClubRegistry.find_club_by_name(name)
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    archers_data = []
    for archer in club.archers:
        archers_data.append({
            "name": archer.name,
            "last_name": archer.last_name,
            "email": archer.email,
            "license_number": archer.license_number
        })
    
    return jsonify({"archers": archers_data}), 200

@app.route("/club/<name>/change", methods=['PUT'])
def update_club(name):
    data = request.get_json()
    club = ClubRegistry.find_club_by_name(name)
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    if "name" in data:
        club.name = data["name"]
    if "adress" in data:
        club.adress = data["adress"]
    if "phone_number" in data:
        club.phone_number = data["phone_number"]
    if "email" in data:
        club.email = data["email"]
    return jsonify({"message": "Club updated"}), 200

@app.route("/archer/<email>/assign", methods=['POST'])
def assign_archer_to_club(email):
    data = request.get_json()
    club_name = data.get('club_name')

    if not club_name:
        return jsonify({"message": "Club name is required"}), 400

    club = next((c for c in ClubRegistry.clubs if c.name == club_name), None)
    if not club:
        return jsonify({"message": f"Club {club_name} not found"}), 404

    archer = ArcherRegistry.find_account_by_email(email)
    if not archer:
        return jsonify({"message": f"Archer with email {email} not found"}), 404

    if archer.club_name == club_name:
        return jsonify({"message": f"Archer {archer.name} {archer.last_name} is already a member of {club_name}"}), 400
    
    if archer.club_name:
        other_club = next((c for c in ClubRegistry.clubs if c.name == archer.club_name), None)
        if other_club:
            return jsonify({"message": f"Archer {archer.name} {archer.last_name} is already a member of another club ({other_club.name})"}), 400

    archer.club_name = club_name
    club.archers.append(archer)

    return jsonify({"message": f"Archer {archer.name} {archer.last_name} assigned to club {club_name}"}), 200

@app.route("/archer/<email>/discharge", methods=['DELETE'])
def delete_from_club(email):
    archer = ArcherRegistry.find_account_by_email(email)
    if archer is None:
        return jsonify({"message": "Account not found"}), 404
    
    club = ClubRegistry.find_club_by_name(archer.club_name)
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    if archer in club.archers:
        club.archers.remove(archer)
        archer.club_name = None
        return jsonify({"message": "Account deleted from club"}), 200
    else:
        return jsonify({"message": "Account not found in club"}), 404
    
@app.route("/trainer/<email>/assign", methods=['POST'])
def assign_trainer_to_club(club_name, email):
    club = next((c for c in ClubRegistry.clubs if c.name == club_name), None)
    if not club:
        return jsonify({"message": f"Club {club_name} not found"}), 404

    trainer = TrainerRegistry.find_account_by_email(email)
    if not trainer:
        return jsonify({"message": f"Trainer with email {email} not found"}), 404

    for other_club in ClubRegistry.clubs:
        if trainer in other_club.trainers:
            if other_club == club:
                trainer.club_name = club_name
                return jsonify({"message": "Trainer is already a member of this club"}), 400
            else:
                return jsonify({
                    "message": f"Trainer {trainer.name} {trainer.last_name} is already a member of another club ({other_club.name})"
                }), 400

    club.trainers.append(trainer)
    return jsonify({"message": f"Trainer {trainer.name} {trainer.last_name} assigned to club {club_name}"}), 200

@app.route("/trainer/<email>/discharge", methods=['DELETE'])
def delete_trainer_from_club(email):
    trainer = TrainerRegistry.find_account_by_email(email)
    if trainer is None:
        return jsonify({"message": "Account not found"}), 404
    
    club = ClubRegistry.find_club_by_name(trainer.club_name)
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    if trainer in club.trainers:
        club.trainers.remove(trainer)
        trainer.club_name = None
        return jsonify({"message": "Account deleted from club"}), 200
    else:
        return jsonify({"message": "Account not found in club"}), 404