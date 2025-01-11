from flask import jsonify, request
from backend import app, db
from datetime import datetime
from backend.models.archer import Archer
from backend.models.trainings import Training

@app.route("/archer/<email>/trainings", methods=['GET'])
def get_trainings(email):
    archer = Archer.query.filter_by(email=email).first()
    if archer is None:
        return jsonify({"message": "Account not found"}), 404
    
    trainings_data = [{
        "quantity_of_shots": training.quantity_of_shots,
        "date": training.date,
        "distance": training.distance
    } for training in archer.trainings]
    
    return jsonify({"trainings": trainings_data}), 200

@app.route("/archer/<email>/trainings/add", methods=['POST'])
def add_training(email):
    data = request.get_json()
    print(f"Add training request: {data}")
    
    archer = Archer.query.filter_by(email=email).first()
    if not archer:
        return jsonify({"message": "Account not found"}), 404
    
    try:
        training_date = datetime.strptime(data["date"], "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DDTHH:MM:SS"}), 400
    
    training = Training(
        quantity_of_shots=data["quantity_of_shots"], 
        date=training_date,
        distance=data["distance"], 
        archer_id=archer.id
    )
    
    db.session.add(training)
    db.session.commit()
    
    return jsonify({"message": "Training added"}), 200

@app.route("/archer/<email>/trainings/delete/<int:training_id>", methods=['DELETE'])
def delete_training(email, training_id):
    archer = Archer.query.filter_by(email=email).first()
    if archer is None:
        return jsonify({"message": "Account not found"}), 404
    
    training = Training.query.filter_by(id=training_id, archer_id=archer.id).first()
    if not training:
        return jsonify({"message": "Training not found"}), 404
    
    db.session.delete(training)
    db.session.commit()

    return jsonify({"message": "Training deleted"}), 200

@app.route("/archer/<email>/trainings/change/<int:training_id>", methods=['PUT'])
def change_training(email, training_id):
    data = request.get_json()
    print(f"Change training request: {data}")
    
    archer = Archer.query.filter_by(email=email).first()
    if archer is None:
        return jsonify({"message": "Account not found"}), 404
    
    training = Training.query.filter_by(id=training_id, archer_id=archer.id).first()
    if not training:
        return jsonify({"message": "Training not found"}), 404
    
    training.quantity_of_shots = data["quantity_of_shots"]
    training.distance = data["distance"]
    
    db.session.commit()

    return jsonify({"message": "Training changed"}), 200


