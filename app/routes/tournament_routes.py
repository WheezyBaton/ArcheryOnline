from flask import request, jsonify
from app import app
from app.models.archer import ArcherRegistry
from datetime import datetime

@app.route("/archer/<email>/tournaments", methods=['GET'])
def get_tournaments(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify({"tournaments": account.tournaments}), 200

@app.route("/archer/<email>/tournament/indoor", methods=['POST'])
def add_indoor_tournament(email):

    data = request.get_json()
    distance = data.get("distance")
    series = data.get("series")

    if distance is None or not isinstance(distance, (int, float)) or distance <= 0:
        return jsonify({"message": "Invalid or missing distance"}), 400

    if not series or not isinstance(series, list) or len(series) != 10:
        return jsonify({"message": "Invalid or missing series data. Must be a list of 10 series"}), 400

    for s in series:
        if not isinstance(s, list) or len(s) != 3 or not all(isinstance(score, int) and 0 <= score <= 10 for score in s):
            return jsonify({"message": "Each series must contain exactly 3 scores (integers between 0 and 10)"}), 400

    archer = ArcherRegistry.find_account_by_email(email)
    if not archer:
        return jsonify({"message": f"Archer with email {email} not found"}), 404

    total_score = sum(sum(s) for s in series)
    tournament = {
        "date": datetime.now().isoformat(),
        "type": "indoor",
        "distance": distance,
        "total_score": total_score,
        "series": series
    }
    archer.tournaments.append(tournament)
    return jsonify({"message": "Indoor tournament added", "tournament": tournament}), 201

@app.route("/archer/<email>/tournament/outdoor", methods=['POST'])
def add_outdoor_tournament(email):

    data = request.get_json()
    distance = data.get("distance")
    series = data.get("series")

    if distance is None or not isinstance(distance, (int, float)) or distance <= 0:
        return jsonify({"message": "Invalid or missing distance"}), 400

    if not series or not isinstance(series, list):
        return jsonify({"message": "Invalid or missing series data. Must be a list of series"}), 400

    archer = ArcherRegistry.find_account_by_email(email)
    if not archer:
        return jsonify({"message": f"Archer with email {email} not found"}), 404

    current_year = datetime.now().year
    age = current_year - archer.birth_year

    if age < 15:
        if len(series) != 12 or any(len(s) != 3 for s in series):
            return jsonify({"message": "For youth tournaments, there must be 12 series with 3 shots each"}), 400
    else:
        if len(series) != 6 or any(len(s) != 6 for s in series):
            return jsonify({"message": "For adult tournaments, there must be 6 series with 6 shots each"}), 400

    for s in series:
        if not all(isinstance(score, int) and 0 <= score <= 10 for score in s):
            return jsonify({"message": "Each score must be an integer between 0 and 10"}), 400

    total_score = sum(sum(s) for s in series)

    tournament_type = "outdoor_youth" if age < 15 else "outdoor_adult"
    tournament = {
        "date": datetime.now().isoformat(),
        "type": "indoor",
        "distance": distance,
        "total_score": total_score,
        "series": series
    }
    archer.tournaments.append(tournament)

    return jsonify({"message": f"{tournament_type.capitalize()} tournament added", "tournament": tournament}), 201