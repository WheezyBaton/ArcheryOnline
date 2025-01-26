from flask import jsonify, request
from backend import app, db
from backend.models.trainer import Trainer
from backend.models.archer import Archer

@app.route("/trainer/add", methods=['POST'])
def create_trainer():
    data = request.get_json()
    print(f"Create account request: {data}")
    
    existing_trainer = Trainer.query.filter_by(email=data["email"]).first()
    if existing_trainer:
        return jsonify({"message": "Account with this email already exists"}), 409
    
    new_trainer = Trainer(
        name=data["name"],
        last_name=data["last_name"],
        email=data["email"],
        phone_number=data["phone_number"],
        license_number=data["license_number"],
        role_id=2
    )
    new_trainer.set_password(data["password"])
    db.session.add(new_trainer)
    db.session.commit()

    return jsonify({"message": "Account created"}), 201

@app.route("/trainer/change/<email>", methods=['PUT'])
def update_trainer(email):
    data = request.get_json()
    trainer = Trainer.query.filter_by(email=email).first()
    if trainer is None:
        return jsonify({"message": "Account not found"}), 404
    
    if "name" in data:
        trainer.name = data["name"]
    if "last_name" in data:
        trainer.last_name = data["last_name"]
    if "email" in data:
        trainer.email = data["email"]
    if "phone_number" in data:
        trainer.phone_number = data["phone_number"]
    if "license_number" in data:
        trainer.license_number = data["license_number"]
    
    db.session.commit()

    return jsonify({"message": "Account updated"}), 200

@app.route("/trainer/personal_data/<email>", methods=['GET'])
def get_trainer(email):
    trainer = Trainer.query.filter_by(email=email).first()
    if trainer is None:
        return jsonify({"message": "Account not found"}), 404
    
    return jsonify({
        "name": trainer.name,
        "last_name": trainer.last_name,
        "email": trainer.email,
        "phone_number": trainer.phone_number,
        "license_number": trainer.license_number,
        "club": trainer.club_id,
    }), 200

@app.route('/trainers/<email>/archers', methods=['GET'])
def get_archers_by_trainer(email):
    trainer = Trainer.query.filter_by(email=email).first()
    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404

    archers = trainer.archers
    archers_data = [
        {
            "id": archer.id,
            "name": archer.name,
            "last_name": archer.last_name,
            "birth_year": archer.birth_year,
            "gender": archer.gender,
            "license_number": archer.license_number,
            "email": archer.email
        }
        for archer in archers
    ]

    return jsonify({"trainer_email": trainer.email, "archers": archers_data}), 200

@app.route("/Trainer/archers/<email>", methods=['GET'])
def get_archers_from_trainer(email):
    trainer = Trainer.query.filter_by(email=email).first()

    if trainer is None:
        return jsonify({"message": "Club not found"}), 404
    
    archers = Archer.query.filter_by(trainer_id=trainer.id).all()

    archers_data = []
    for archer in archers:
        archers_data.append({
            "name": archer.name,
            "last_name": archer.last_name,
            "email": archer.email,
            "license_number": archer.license_number
        })
    
    return jsonify({"archers": archers_data}), 200