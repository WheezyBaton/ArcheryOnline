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

    club = Club(name=data["name"], address=data["address"], phone_number=data["phone_number"], email=data["email"], role_id=1)
    club.set_password(data["password"])
    db.session.add(club)
    db.session.commit()

    return jsonify({"message": "Club created"}), 201

@app.route("/club/<name>/delete", methods=['DELETE'])
def delete_club(name):
    club = Club.query.filter_by(name=name).first()
    
    if club is None:
        return jsonify({"message": "Club not found"}), 404

    db.session.delete(club)
    db.session.commit()

    return jsonify({"message": "Club deleted"}), 200

@app.route("/club/<name>", methods=['GET'])
def get_club(name):
    club = Club.query.filter_by(name=name).first()

    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    return jsonify({
        "name": club.name,
        "address": club.address,
        "phone_number": club.phone_number,
        "email": club.email
    }), 200

@app.route("/club/<name>/archers", methods=['GET'])
def get_archers_from_club(name):
    club = Club.query.filter_by(name=name).first()

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

@app.route("/club/<name>/change", methods=['PUT'])
def update_club(name):
    data = request.get_json()
    
    club = Club.query.filter_by(name=name).first()
    
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
    
@app.route("/trainer/<email>/assign/<club_name>", methods=['POST'])
def assign_trainer_to_club(email, club_name):
    club = Club.query.filter_by(name=club_name).first()
    if not club:
        return jsonify({"message": f"Club {club_name} not found"}), 404

    trainer = Trainer.query.filter_by(email=email).first()
    if not trainer:
        return jsonify({"message": f"Trainer with email {email} not found"}), 404

    if trainer.club_id: 
        return jsonify({
            "message": f"Trainer {trainer.name} {trainer.last_name} is already a member of another club"
        }), 400

    trainer.club_id = club.id
    db.session.commit()

    return jsonify({"message": f"Trainer {trainer.name} {trainer.last_name} assigned to club {club_name}"}), 200

@app.route("/trainer/<email>/discharge", methods=['DELETE'])
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