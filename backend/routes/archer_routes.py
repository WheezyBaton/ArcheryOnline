from flask import jsonify, request
from backend import app, db
from backend.models.archer import Archer
from backend.models.trainer import Trainer
from backend.models.club import Club

@app.route("/archer/add", methods=['POST'])
def create_archer():
    data = request.get_json()
    print(f"Create account request: {data}")
    
    existing_archer = Archer.query.filter_by(email=data["email"]).first()
    existing_trainer = Trainer.query.filter_by(email=data["email"]).first()
    existing_club = Club.query.filter_by(email=data["email"]).first()
    if existing_archer or existing_trainer or existing_club:
        return jsonify({"message": "Account already exists"}), 409
    
    archer = Archer(name=data["name"], last_name=data["last_name"], birth_year=data["birth_year"], gender=data["gender"], email=data["email"], role_id=3)
    archer.set_password(data["password"])
    db.session.add(archer)
    db.session.commit()
    
    return jsonify({"message": "Account created"}), 201

@app.route("/archer/change/<email>", methods=['PUT'])
def update_archer(email):
    data = request.get_json()
    
    account = Archer.query.filter_by(email=email).first()
    
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    
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
    
    db.session.commit()

    return jsonify({"message": "Account updated"}), 200

@app.route("/archer/personal_data/<email>", methods=['GET'])
def get_archer(email):

    account = Archer.query.filter_by(email=email).first()
    if not account:
        return jsonify({"message": "Account not found"}), 404
    
    return jsonify({
        "name": account.name,
        "last_name": account.last_name,
        "birth_year": account.birth_year,
        "gender": account.gender,
        "email": account.email,
        "license_number": account.license_number,
        "club": account.club_id,
        "trainer": account.trainer_id
    }), 200

@app.route("/archer/<email>/trainer", methods=['GET'])
def get_archer_trainer(email):
    archer = Archer.query.filter_by(email=email).first()
    if not archer:
        return jsonify({"message": "Archer not found"}), 404

    if not archer.trainer_id:
        return jsonify({"message": "No trainer assigned"}), 404

    trainer = Trainer.query.get(archer.trainer_id)
    if not trainer:
        return jsonify({"message": "Trainer not found"}), 404

    return jsonify({
        "name": trainer.name,
        "last_name": trainer.last_name,
        "email": trainer.email,
        "phone_number": trainer.phone_number,
        "license_number": trainer.license_number,
        "club": trainer.club_id
    }), 200

@app.route("/archer/<email>/club", methods=['GET'])
def get_archer_club(email):
    archer = Archer.query.filter_by(email=email).first()
    if not archer:
        return jsonify({"message": "Archer not found"}), 404

    if not archer.club_id:
        return jsonify({"message": "No club assigned"}), 404

    club = Club.query.get(archer.club_id)
    if not club:
        return jsonify({"message": "Club not found"}), 404

    return jsonify({
        "name": club.name,
        "address": club.address,
        "phone_number": club.phone_number,
        "email": club.email
    }), 200