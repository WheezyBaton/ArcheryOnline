from flask import jsonify, request
from backend import app, db, socketio
from backend.models.archer import Archer
from backend.models.trainer import Trainer
from backend.models.club import Club

@app.route("/club/add", methods=['POST'])
def create_club():
    data = request.get_json()
    print(f"Create club request: {data}")

    existing_club = Club.query.filter(
        (Club.name == data["name"]) | 
        (Club.address == data["address"]) | 
        (Club.phone_number == data["phone_number"]) | 
        (Club.email == data["email"])
    ).first()

    if existing_club:
        return jsonify({"message": "Club already exists"}), 409

    club = Club(
        name=data["name"], 
        address=data["address"], 
        phone_number=data["phone_number"], 
        email=data["email"], 
        role_id=1
    )
    club.set_password(data["password"])
    db.session.add(club)
    db.session.commit()

    return jsonify({"message": "Club created"}), 201

@app.route("/club/delete/<name>", methods=['DELETE'])
def delete_club(name):
    club = Club.query.filter_by(name=name).first()
    
    if club is None:
        return jsonify({"message": "Club not found"}), 404

    db.session.delete(club)
    db.session.commit()

    return jsonify({"message": "Club deleted"}), 200

@app.route("/club/<email>", methods=['GET'])
def get_club(email):
    club = Club.query.filter_by(email=email).first()

    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    return jsonify({
        "name": club.name,
        "address": club.address,
        "phone_number": club.phone_number,
        "email": club.email
    }), 200

@app.route("/Club Manager/archers/<email>", methods=['GET'])
def get_archers_from_club(email):
    club = Club.query.filter_by(email=email).first()

    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    archers = Archer.query.filter_by(club_id=club.id).all()

    archers_data = []
    for archer in archers:
        archers_data.append({
            "name": archer.name,
            "last_name": archer.last_name,
            "email": archer.email,
        })
    
    return jsonify({"archers": archers_data}), 200

@app.route("/club/trainers/<email>", methods=['GET'])
def get_trainers_from_club(email):
    club = Club.query.filter_by(email=email).first()

    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    trainers = Trainer.query.filter_by(club_id=club.id).all()

    trainers_data = []
    for trainer in trainers:
        trainers_data.append({
            "name": trainer.name,
            "last_name": trainer.last_name,
            "email": trainer.email,
        })
    
    return jsonify({"trainers": trainers_data}), 200

@app.route("/club/change/<email>", methods=['PUT'])
def update_club(email):
    data = request.get_json()
    
    club = Club.query.filter_by(email=email).first()
    
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    if "name" in data:
        club.name = data["name"]
    if "address" in data:
        club.address = data["address"]
    if "phone_number" in data:
        club.phone_number = data["phone_number"]
    if "email" in data:
        club.email = data["email"]
    
    db.session.commit()
    
    return jsonify({"message": "Club updated"}), 200

@app.route("/trainer/discharge/<email>", methods=['DELETE'])
def delete_trainer_from_club(email):
    trainer = Trainer.query.filter_by(email=email).first()
    if trainer is None:
        return jsonify({"message": "Account not found"}), 404
    
    club = Club.query.get(trainer.club_id)
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    if trainer in club.trainers:
        club.trainers.remove(trainer)
        trainer.club_id = None 
        db.session.commit()
        return jsonify({"message": "Account deleted from club"}), 200
    else:
        return jsonify({"message": "Account not found in club"}), 404

@app.route("/archer/discharge/<email>", methods=['DELETE'])
def delete_archer_from_club(email):
    archer = Archer.query.filter_by(email=email).first()
    if archer is None:
        return jsonify({"message": "Account not found"}), 404
    
    club = Club.query.get(archer.club_id)
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    if archer in club.archers:
        club.archers.remove(archer)
        archer.club_id = None 
        db.session.commit()
        return jsonify({"message": "Account deleted from club"}), 200
    else:
        return jsonify({"message": "Account not found in club"}), 404

@app.route('/assign/<club_email>/<archer_email>/<trainer_email>', methods=['POST'])
def assign_archer_to_trainer(club_email, archer_email, trainer_email):
    club = Club.query.filter_by(email=club_email).first()
    if not club:
        return jsonify({"error": "Club not found"}), 404

    archer = Archer.query.filter_by(email=archer_email, club_id=club.id).first()
    if not archer:
        return jsonify({"error": "Archer not found in this club"}), 404

    trainer = Trainer.query.filter_by(email=trainer_email, club_id=club.id).first()
    if not trainer:
        return jsonify({"error": "Trainer not found in this club"}), 404

    archer.trainer_id = trainer.id
    db.session.commit()

    return jsonify({
        "message": f"Archer '{archer.name} {archer.last_name}' has been assigned to Trainer '{trainer.name} {trainer.last_name}'"
    }), 200


@app.route('/discharge/<club_email>/<archer_email>/<trainer_email>', methods=['POST'])
def discharge_archer_from_trainer(club_email, archer_email, trainer_email):
    club = Club.query.filter_by(email=club_email).first()
    if not club:
        return jsonify({"error": "Club not found"}), 404

    archer = Archer.query.filter_by(email=archer_email, club_id=club.id).first()
    if not archer:
        return jsonify({"error": "Archer not found in this club"}), 404

    trainer = Trainer.query.filter_by(email=trainer_email, club_id=club.id).first()
    if not trainer:
        return jsonify({"error": "Trainer not found in this club"}), 404

    if archer.trainer_id != trainer.id:
        return jsonify({
            "error": f"Archer '{archer.name} {archer.last_name}' is not assigned to Trainer '{trainer.name} {trainer.last_name}'"
        }), 400

    archer.trainer_id = None
    db.session.commit()

    return jsonify({
        "message": f"Archer '{archer.name} {archer.last_name}' has been discharge from Trainer '{trainer.name} {trainer.last_name}'"
    }), 200

def send_invitation(user, user_type, club):
    zaproszenie = {
        'email': user.email,
        'name': f"{user.name} {user.last_name}",
        'user_type': user_type,
        'club_email': club.email,
        'club_name': club.name,
    }
    socketio.emit('zaproszenie_klubowe', zaproszenie)

@app.route("/archer/assign/<archer_email>/<club_email>", methods=['POST'])
def assign_archer_to_club(archer_email, club_email):
    club = Club.query.filter_by(email=club_email).first()
    if not club:
        return jsonify({"message": f"Club {club_email} not found"}), 404

    archer = Archer.query.filter_by(email=archer_email).first()
    if not archer:
        return jsonify({"message": f"Archer with email {archer_email} not found"}), 404

    if archer.club_id:
        return jsonify({
            "message": f"Archer {archer.name} {archer.last_name} is already a member of another club"
        }), 400

    send_invitation(archer, 'archer', club)

    return jsonify({
        "message": f"Invitation sent to archer {archer.name} {archer.last_name} for club {club.name}. Waiting for acceptance."
    }), 200

@app.route("/trainer/assign/<trainer_email>/<club_email>", methods=['POST'])
def assign_trainer_to_club(trainer_email, club_email):
    club = Club.query.filter_by(email=club_email).first()
    if not club:
        return jsonify({"message": f"Club {club_email} not found"}), 404

    trainer = Trainer.query.filter_by(email=trainer_email).first()
    if not trainer:
        return jsonify({"message": f"Trainer with email {trainer_email} not found"}), 404

    if trainer.club_id:
        return jsonify({
            "message": f"Trainer {trainer.name} {trainer.last_name} is already a member of another club"
        }), 400

    send_invitation(trainer, 'trainer', club)

    return jsonify({
        "message": f"Invitation sent to trainer {trainer.name} {trainer.last_name} for club {club.name}. Waiting for acceptance."
    }), 200

@app.route("/accept-invite/<user_email>/<user_type>/<club_email>", methods=['POST'])
def accept_invite(user_email, user_type, club_email):
    club = Club.query.filter_by(email=club_email).first()
    if not club:
        return jsonify({"message": f"Club {club_email} not found"}), 404

    if user_type == 'archer':
        user = Archer.query.filter_by(email=user_email).first()
    elif user_type == 'trainer':
        user = Trainer.query.filter_by(email=user_email).first()
    else:
        return jsonify({"message": "Invalid user type"}), 400

    if not user:
        return jsonify({"message": f"{user_type.capitalize()} with email {user_email} not found"}), 404

    if user.club_id:
        return jsonify({
            "message": f"{user_type.capitalize()} {user.name} {user.last_name} is already a member of another club"
        }), 400

    user.club_id = club.id
    db.session.commit()

    return jsonify({
        "message": f"{user_type.capitalize()} {user.name} {user.last_name} successfully joined club {club.name}."
    }), 200