from flask import jsonify, request
from backend import app, db
from backend.models.archer import Archer
from backend.models.trainer import Trainer
from backend.models.club import Club

@app.route("/club/add", methods=['POST'])
def create_club():
    data = request.get_json()
    print(f"Create club request: {data}")

    existing_club = Club.query.filter(
        (Club.name == data["name"]) | 
        (Club.address == data["address"]) | 
        (Club.phone_number == data["phone_number"]) | 
        (Club.email == data["email"])
    ).first()

    if existing_club:
        return jsonify({"message": "Club already exists"}), 409

    club = Club(
        name=data["name"], 
        address=data["address"], 
        phone_number=data["phone_number"], 
        email=data["email"], 
        role_id=1
    )
    club.set_password(data["password"])
    db.session.add(club)
    db.session.commit()

    return jsonify({"message": "Club created"}), 201

@app.route("/club/delete/<name>", methods=['DELETE'])
def delete_club(name):
    club = Club.query.filter_by(name=name).first()
    
    if club is None:
        return jsonify({"message": "Club not found"}), 404

    db.session.delete(club)
    db.session.commit()

    return jsonify({"message": "Club deleted"}), 200

@app.route("/club/<email>", methods=['GET'])
def get_club(email):
    club = Club.query.filter_by(email=email).first()

    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    return jsonify({
        "name": club.name,
        "address": club.address,
        "phone_number": club.phone_number,
        "email": club.email
    }), 200

@app.route("/club/archers/<email>", methods=['GET'])
def get_archers_from_club(email):
    club = Club.query.filter_by(email=email).first()

    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    archers = Archer.query.filter_by(club_id=club.id).all()

    archers_data = []
    for archer in archers:
        archers_data.append({
            "name": archer.name,
            "last_name": archer.last_name,
            "email": archer.email,
            "license_number": archer.license_number
        })
    
    return jsonify({"archers": archers_data}), 200

@app.route("/club/change/<email>", methods=['PUT'])
def update_club(email):
    data = request.get_json()
    
    club = Club.query.filter_by(email=email).first()
    
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    if "name" in data:
        club.name = data["name"]
    if "address" in data:
        club.address = data["address"]
    if "phone_number" in data:
        club.phone_number = data["phone_number"]
    if "email" in data:
        club.email = data["email"]
    
    db.session.commit()
    
    return jsonify({"message": "Club updated"}), 200
    
@app.route("/trainer/assign/<trainer_email>/<club_email>", methods=['POST'])
def assign_trainer_to_club(trainer_email, club_email):
    club = Club.query.filter_by(email=club_email).first()
    if not club:
        return jsonify({"message": f"Club {club_email} not found"}), 404

    trainer = Trainer.query.filter_by(email=trainer_email).first()
    if not trainer:
        return jsonify({"message": f"Trainer with email {trainer_email} not found"}), 404

    if trainer.club_id: 
        return jsonify({
            "message": f"Trainer {trainer.name} {trainer.last_name} is already a member of another club"
        }), 400

    trainer.club_id = club.id
    db.session.commit()

    return jsonify({"message": f"Trainer {trainer.name} {trainer.last_name} assigned to club {club_email}"}), 200

@app.route("/trainer/discharge/<email>", methods=['DELETE'])
def delete_trainer_from_club(email):
    trainer = Trainer.query.filter_by(email=email).first()
    if trainer is None:
        return jsonify({"message": "Account not found"}), 404
    
    club = Club.query.filter_by(name=trainer.club_name).first()
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    if trainer in club.trainers:
        club.trainers.remove(trainer)
        trainer.club_name = None 
        db.session.commit()
        return jsonify({"message": "Account deleted from club"}), 200
    else:
        return jsonify({"message": "Account not found in club"}), 404
    
@app.route("/archer/assign/<archer_email>/<club_email>", methods=['POST'])
def assign_archer_to_club(archer_email, club_email):
    club = Club.query.filter_by(email=club_email).first()
    if not club:
        return jsonify({"message": f"Club {club_email} not found"}), 404

    archer = Archer.query.filter_by(email=archer_email).first()
    if not archer:
        return jsonify({"message": f"Archer with email {archer_email} not found"}), 404

    if archer.club_id: 
        return jsonify({
            "message": f"Archer {archer.name} {archer.last_name} is already a member of another club"
        }), 400

    archer.club_id = club.id
    db.session.commit()

    return jsonify({"message": f"Archer {archer.name} {archer.last_name} assigned to club {club_email}"}), 200

@app.route("/archer/discharge/<email>", methods=['DELETE'])
def delete_archer_from_club(email):
    archer = Archer.query.filter_by(email=email).first()
    if archer is None:
        return jsonify({"message": "Account not found"}), 404
    
    club = Club.query.filter_by(name=archer.club_name).first()
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    if archer in club.trainers:
        club.trainers.remove(archer)
        archer.club_name = None 
        db.session.commit()
        return jsonify({"message": "Account deleted from club"}), 200
    else:
        return jsonify({"message": "Account not found in club"}), 404