from flask import jsonify, request, make_response
from backend import app, db
from backend.api import decode_token
from backend.models.archer import Archer
from backend.models.trainer import Trainer
from backend.models.club import Club
from backend.models.trainings import Training
from backend.models.tournaments import Tournament
import jwt
from datetime import datetime, timedelta

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = None
    if Archer.query.filter_by(email=email).first() != None:
        user = Archer.query.filter_by(email=email).first()
        role = 'Archer'
    elif Trainer.query.filter_by(email=email).first() != None:
        user = Trainer.query.filter_by(email=email).first()
        role = 'Trainer'
    elif Club.query.filter_by(email=email).first() != None:
        user = Club.query.filter_by(email=email).first()
        role = 'Club Manager'
    else:
        return jsonify({'error': 'Invalid email'}), 400

    if user is None or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = jwt.encode({
        'user_id': user.id,
        'role': role,
        'email': user.email,
        'birth_year': getattr(user, 'birth_year', None),
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
        secure=False,
        samesite='Strict',
        max_age=3600
    )

    return response

@app.route('/protected', methods=['GET'])
def protected():
    token = request.cookies.get(app.config['JWT_COOKIE_NAME'])
    print("Token from cookies:", token)

    if not token:
        auth_header = request.headers.get('Authorization')
        print("Authorization header:", auth_header)
        if auth_header:
            token = auth_header.split(" ")[1]
    
    if not token:
        print("No token found in cookies or headers")
        return jsonify({'error': 'No token found'}), 400

    try:
        token = token.split(" ")[1] if " " in token else token
    except IndexError:
        return jsonify({'error': 'Token malformed'}), 400

    user_data = decode_token(token)

    if "error" in user_data:
        return jsonify({'error': user_data['error']}), 401

    return jsonify({'message': 'Access granted', 'user': user_data})

invalid_tokens = set()

@app.route('/logout', methods=['POST'])
def logout():
    token = request.cookies.get(app.config['JWT_COOKIE_NAME'])
    print("Token from cookies:", token)

    if not token:
        auth_header = request.headers.get('Authorization')
        print("Authorization header:", auth_header)
        if auth_header:
            token = auth_header.split(" ")[1] 
    
    if not token:
        print("No token found in cookies or headers")
        return jsonify({'error': 'No token found'}), 400

    invalid_tokens.add(token)

    response = make_response({
        'message': 'Logged out successfully',
        'access_token': token 
    })
    response.set_cookie(
        app.config['JWT_COOKIE_NAME'],
        '',
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=1
    )

    return response

@app.route("/account/delete/<email>", methods=['DELETE'])
def delete_account(email):
    account = Archer.query.filter_by(email=email).first()
    if account:
        Training.query.filter_by(archer_id=account.id).delete()
        Tournament.query.filter_by(archer_id=account.id).delete()

        db.session.delete(account)
        db.session.commit()

        return jsonify({"message": "Archer account, trainings, and tournaments deleted"}), 200

    account = Trainer.query.filter_by(email=email).first()
    if account:
        db.session.delete(account)
        db.session.commit()

        return jsonify({"message": "Trainer account deleted"}), 200
    
    return jsonify({"message": "Account not found"}), 404