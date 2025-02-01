import sys
import os
import jwt
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend import app, db, socketio
from backend.models.role import Role
from flask_socketio import emit, join_room, leave_room

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

@socketio.on('message')
def handle_message(data):
    room = data.get('room')
    message = data.get('message')
    user_email = data.get('user_email', "Unknown")
    user_role = data.get('user_role', "Unknown role")
    message_id = data.get('message_id')

    if not room or not message or not message_id:
        print("Incorrect message received:", data)
        return

    emit('message', {
        'message': message,
        'user_email': user_email,
        'user_role': user_role,
        'room': room,
        'message_id': message_id,
    }, room=room)

@socketio.on('join')
def join_room_function(data):
    room = data.get('room')
    user_role = data.get('user_role')
    user_email = data.get('user_email')

    if not room or not user_role or not user_email:
        print("No required data in event 'join'", data)
        return

    if room == "Clubs Managers room" and user_role not in ["Club Manager"]:
            emit('message', {
                'room': room,
                'message': "No access to this room",
                'user_email': "",
                'user_role': "System"
            }, room=user_email)
            return

    if room == "Trainers room" and user_role not in ["Trainer"]:
        emit('message', {
            'room': room,
            'message': "No access to this room",
            'user_email': "",
            'user_role': "System"
        }, room=user_email)
        return

    if room == "Archers room" and user_role not in ["Archer"]:
        emit('message', {
            'room': room,
            'message': "No access to this room",
            'user_email': "",
            'user_role': "System"
        }, room=user_email)
        return

    join_room(room)
    print(f"{user_email} joined {room}")

    emit('message', {
        'room': room,
        'message': f'User {user_email} has joined the room',
        'user_email': "",
        'user_role': "System"
    }, room=room)

@socketio.on('leave')
def leave_room_function(data):
    room = data['room']
    leave_room(room)


