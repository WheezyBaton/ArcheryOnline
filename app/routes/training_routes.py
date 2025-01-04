from flask import jsonify, request
from app import app
from app.models.archer import ArcherRegistry

@app.route("/archer/<email>/trainings", methods=['GET'])
def get_trainings(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"trainings": account.trainings}), 200

@app.route("/archer/<email>/trainings/add", methods=['POST'])
def add_training(email):
    data = request.get_json()
    print(f"Add training request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.add_training(data["quantity_of_shots"], data["distance"])
    return jsonify({"message": "Training added"}), 200

@app.route("/archer/<email>/trainings/delete", methods=['DELETE'])
def delete_training(email):
    data = request.get_json()
    print(f"Delete training request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.delete_training(data["date"])
    return jsonify({"message": "Training deleted"}), 200

@app.route("/archer/<email>/trainings/change", methods=['PUT'])
def change_training(email):
    data = request.get_json()
    print(f"Change training request: {data}")
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    account.delete_training(data["date"])
    account.add_training(data["quantity_of_shots"], data["distance"])
    return jsonify({"message": "Training changed"}), 200


