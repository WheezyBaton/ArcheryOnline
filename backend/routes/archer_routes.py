from flask import jsonify, request
from backend import app, db
from backend.models.archer import Archer

@app.route("/archer/add", methods=['POST'])
def create_archer():
    data = request.get_json()
    print(f"Create account request: {data}")
    
    existing_archer = Archer.query.filter_by(email=data["email"]).first()
    if existing_archer:
        return jsonify({"message": "Archer already exists"}), 409
    
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

    }), 200
