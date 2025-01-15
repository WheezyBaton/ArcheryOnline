from flask import jsonify, request, make_response
from backend import app
from backend.models.archer import Archer
from backend.models.trainer import Trainer
from backend.models.club import Club
import jwt
from datetime import datetime, timedelta

@app.route('/login/<function>', methods=['POST'])
def login(function):
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = None
    if function == 'archer':
        user = Archer.query.filter_by(email=email).first()
    elif function == 'trainer':
        user = Trainer.query.filter_by(email=email).first()
    elif function == 'club_manager':
        user = Club.query.filter_by(email=email).first()
    else:
        return jsonify({'error': 'Invalid function'}), 400

    if user is None or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = jwt.encode({
        'user_id': user.id,
        'role': function,
        'exp': datetime.utcnow() + timedelta(hours=1)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    response = jsonify({
        'message': 'Login successful',
        'access_token': token
    })

    response.set_cookie(
        app.config['JWT_COOKIE_NAME'],
        token,
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=3600
    )

    return response

def decode_token(token):
    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}

@app.route('/protected', methods=['GET'])
def protected():
    token = request.cookies.get(app.config['JWT_COOKIE_NAME'])

    if not token or token in invalid_tokens:
        return jsonify({'error': 'Unauthorized access'}), 401

    user_data = decode_token(token)
    
    if "error" in user_data:
        return jsonify({'error': user_data['error']}), 401

    return jsonify({'message': 'Access granted', 'user': user_data})

invalid_tokens = set()

@app.route('/logout', methods=['POST'])
def logout():
    token = request.cookies.get(app.config['JWT_COOKIE_NAME'])

    if token:
        invalid_tokens.add(token)

        response = make_response({'message': 'Logged out successfully'})
        response.set_cookie(
            app.config['JWT_COOKIE_NAME'],
            '',
            httponly=True,
            secure=True,
            samesite='Strict',
            max_age=0 
        )

        return response
    else:
        return jsonify({'error': 'No token found'}), 400

