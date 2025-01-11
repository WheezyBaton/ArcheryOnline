from flask import jsonify, request
from backend import app, db
from backend.models.trainer import Trainer

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
        license_number=data["license_number"]
    )
    
    db.session.add(new_trainer)
    db.session.commit()

    return jsonify({"message": "Account created"}), 201

@app.route("/trainer/<email>/delete", methods=['DELETE'])
def delete_trainer(email):
    trainer = Trainer.query.filter_by(email=email).first()
    if trainer is None:
        return jsonify({"message": "Account not found"}), 404
    
    db.session.delete(trainer)
    db.session.commit()

    return jsonify({"message": "Account deleted"}), 200

@app.route("/trainer/<email>/change", methods=['PUT'])
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

@app.route("/trainer/<email>/personal_data", methods=['GET'])
def get_trainer(email):
    trainer = Trainer.query.filter_by(email=email).first()
    if trainer is None:
        return jsonify({"message": "Account not found"}), 404
    
    return jsonify({
        "name": trainer.name,
        "last_name": trainer.last_name,
        "email": trainer.email,
        "phone_number": trainer.phone_number,
        "license_number": trainer.license_number
    }), 200