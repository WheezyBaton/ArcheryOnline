from flask import jsonify, request
from backend import app, db
from datetime import datetime
from backend.models.archer import Archer
from backend.models.tournaments import Tournament

@app.route("/archer/<email>/tournaments", methods=['GET'])
def get_tournaments(email):
    archer = Archer.query.filter_by(email=email).first()
    if archer is None:
        return jsonify({"message": "Account not found"}), 404
    tournaments = [{"date": t.date, "type": t.type, "distance": t.distance, "total_score": t.total_score, "series": t.series} for t in archer.tournaments]
    return jsonify({"tournaments": tournaments}), 200

@app.route("/archer/<email>/tournaments/indoor", methods=['POST'])
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

    archer = Archer.query.filter_by(email=email).first()
    if not archer:
        return jsonify({"message": f"Archer with email {email} not found"}), 404

    total_score = sum(sum(s) for s in series)
    tournament = Tournament(
        date=datetime.now(),
        type="indoor",
        distance=distance,
        total_score=total_score,
        series=series,
        archer_id=archer.id
    )
    db.session.add(tournament)
    db.session.commit()
    return jsonify({"message": "Indoor tournament added", "tournament": tournament.to_dict()}), 201

@app.route("/archer/<email>/tournaments/outdoor", methods=['POST'])
def add_outdoor_tournament(email):
    data = request.get_json()
    distance = data.get("distance")
    series = data.get("series")

    if distance is None or not isinstance(distance, (int, float)) or distance <= 0:
        return jsonify({"message": "Invalid or missing distance"}), 400

    if not series or not isinstance(series, list):
        return jsonify({"message": "Invalid or missing series data. Must be a list of series"}), 400

    archer = Archer.query.filter_by(email=email).first()
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
    tournament = Tournament(
        date=datetime.now(),
        type=tournament_type,
        distance=distance,
        total_score=total_score,
        series=series,
        archer_id=archer.id
    )
    db.session.add(tournament)
    db.session.commit()

    return jsonify({"message": f"{tournament_type.capitalize()} tournament added", "tournament": tournament.to_dict()}), 201

@app.route("/archer/<email>/tournaments/delete/<int:tournament_id>", methods=['DELETE'])
def delete_tournament(email, tournament_id):
    archer = Archer.query.filter_by(email=email).first()
    if not archer:
        return jsonify({"message": f"Archer with email {email} not found"}), 404

    tournament = Tournament.query.filter_by(id=tournament_id, archer_id=archer.id).first()
    if not tournament:
        return jsonify({"message": "Tournament not found"}), 404

    db.session.delete(tournament)
    db.session.commit()

    return jsonify({"message": "Tournament deleted"}), 200