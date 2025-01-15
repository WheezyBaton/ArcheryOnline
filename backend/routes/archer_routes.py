from flask import jsonify, request
from backend import app, db
from datetime import datetime
from backend.models.archer import Archer
from backend.models.trainings import Training
from backend.models.shots import Shots
from backend.models.chord import Chord
from backend.models.tournaments import Tournament

@app.route("/archer/add", methods=['POST'])
def create_archer():
    data = request.get_json()
    print(f"Create account request: {data}")
    
    existing_archer = Archer.query.filter_by(email=data["email"]).first()
    if existing_archer:
        return jsonify({"message": "Archer already exists"}), 409
    
    archer = Archer(name=data["name"], last_name=data["last_name"], birth_year=data["birth_year"], gender=data["gender"], email=data["email"])
    archer.set_password(data["password"])
    db.session.add(archer)
    db.session.commit()
    
    return jsonify({"message": "Account created"}), 201

@app.route("/archer/<email>/change/license_number", methods=['PUT'])
def add_license(email):
    data = request.get_json()
    print(f"Add license request: {data}")
    
    account = Archer.query.filter_by(email=email).first()
    if not account:
        return jsonify({"message": "Account not found"}), 404
    
    account.license_number = data["license_number"]
    db.session.commit()
    
    return jsonify({"message": "License added"}), 200

@app.route("/archer/<email>/change/shots", methods=['PUT'])
def add_shots(email):
    data = request.get_json()
    print(f"Add shots request: {data}")
    
    account = Archer.query.filter_by(email=email).first()
    if not account:
        return jsonify({"message": "Account not found"}), 404
    
    try:
        data_purchased = datetime.strptime(data["data_purchased"], "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        return jsonify({"message": "Invalid date format, expected YYYY-MM-DDTHH:MM:SS"}), 400
    
    wear = data.get("wear", 0)

    shots = Shots(name=data["name"], model=data["model"], tip_weight=data["tip_weight"], length=data["length"],
                  hard=data["hard"], parameter=data["parameter"], data_purchased=data_purchased, 
                  quantity=data["quantity"], wear=wear, id_archer=account.id)
    db.session.add(shots)
    db.session.commit()
    
    return jsonify({"message": "Shots added"}), 200

@app.route("/archer/<email>/change/chord", methods=['PUT'])
def add_chord(email):
    data = request.get_json()
    print(f"Add chord request: {data}")
    
    account = Archer.query.filter_by(email=email).first()
    if not account:
        return jsonify({"message": "Account not found"}), 404
    
    try:
        data_purchased = datetime.strptime(data["data_purchased"], "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        return jsonify({"message": "Invalid date format, expected YYYY-MM-DDTHH:MM:SS"}), 400
    
    chord = Chord(data_purchased=data_purchased, wear=data["wear"], id_archer=account.id)
    
    db.session.add(chord)
    db.session.commit()
    
    return jsonify({"message": "Chord added"}), 200

@app.route("/archer/<email>/change", methods=['PUT'])
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
    
@app.route("/archer/<email>/delete", methods=['DELETE'])
def delete_archer(email):
    account = Archer.query.filter_by(email=email).first()
    
    if not account:
        return jsonify({"message": "Archer not found"}), 404

    Training.query.filter_by(archer_id=account.id).delete()

    Tournament.query.filter_by(archer_id=account.id).delete()

    if db.session.query(Shots).filter_by(id_archer=account.id).count() > 0:
        Shots.query.filter_by(id_archer=account.id).update({"id_archer": None})

    if db.session.query(Chord).filter_by(id_archer=account.id).count() > 0:
        Chord.query.filter_by(id_archer=account.id).update({"id_archer": None})

    db.session.delete(account)
    db.session.commit()

    return jsonify({"message": "Archer, trainings, and tournaments deleted"}), 200

@app.route("/archer/<email>/personal_data", methods=['GET'])
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
        "license_number": account.license_number
    }), 200

@app.route("/archer/<email>/equipment", methods=['GET'])
def get_equipment(email):
    account = Archer.query.filter_by(email=email).first()
    
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    
    shots = Shots.query.filter_by(id_archer=account.id).all()
    chord = Chord.query.filter_by(id_archer=account.id).first()
    
    shots_list = [shot.to_dict() for shot in shots]
    chord_dict = chord.to_dict() if chord else None
    
    return jsonify({
        "shots": shots_list,
        "chord": chord_dict
    }), 200