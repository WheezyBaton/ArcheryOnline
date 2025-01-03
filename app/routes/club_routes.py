from flask import jsonify
from app import app
from app.models.club import ClubRegistry
from app.models.archer import ArcherRegistry

@app.route("/archer/<email>/assign", methods=['POST'])
def assign_archer_to_club(club_name, email):
    club = next((c for c in ClubRegistry.clubs if c.name == club_name), None)
    if not club:
        return jsonify({"message": f"Club {club_name} not found"}), 404

    archer = ArcherRegistry.find_account_by_email(email)
    if not archer:
        return jsonify({"message": f"Archer with email {email} not found"}), 404

    for other_club in ClubRegistry.clubs:
        if archer in other_club.archers:
            if other_club == club:
                return jsonify({"message": "Archer is already a member of this club"}), 400
            else:
                return jsonify({
                    "message": f"Archer {archer.name} {archer.last_name} is already a member of another club ({other_club.name})"
                }), 400

    club.archers.append(archer)
    return jsonify({"message": f"Archer {archer.name} {archer.last_name} assigned to club {club_name}"}), 200

@app.route("/archer/<email>", methods=['DELETE'])
def delete_from_club(email):
    account = ArcherRegistry.find_account_by_email(email)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    
    club = ClubRegistry.find_club_by_name(account.club_name)
    if club is None:
        return jsonify({"message": "Club not found"}), 404
    
    if account in club.archers:
        club.archers.remove(account)
        return jsonify({"message": "Account deleted from club"}), 200
    else:
        return jsonify({"message": "Account not found in club"}), 404