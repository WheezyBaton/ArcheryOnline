from flask import jsonify
from app import app
from app.models.archer import ArcherRegistry

@app.route("/archer/<email>/trainings", methods=['GET'])
def get_trainings(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"trainings": account.trainings}), 200