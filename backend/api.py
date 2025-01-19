import sys
import os
import jwt
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend import app, db
from backend.models.role import Role

with app.app_context():
    db.create_all()

    if not Role.query.filter_by(name="Club Manager").first():
        club_manager = Role(name="Club Manager")
        db.session.add(club_manager)

    if not Role.query.filter_by(name="Trainer").first():
        trainer = Role(name="Trainer")
        db.session.add(trainer)

    if not Role.query.filter_by(name="Archer").first():
        archer = Role(name="Archer")
        db.session.add(archer)

    db.session.commit()

def generate_token(user_id, role, expiration_minutes=60):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(minutes=expiration_minutes)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

def decode_token(token):
    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        print(f"Decoded token: {decoded}")
        return decoded
    except jwt.ExpiredSignatureError:
        print("Error: Token has expired.")
        return {"error": "Token has expired."}
    except jwt.InvalidTokenError:
        print("Error: Invalid token.")
        return {"error": "Invalid token."}

if __name__ == '__main__':
    app.run(port=5000, debug=True)