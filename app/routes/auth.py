"""Authentication routes for login, register, and token refresh."""
from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.models import db, User
from app.schemas import (
    UserRegisterSchema,
    UserLoginSchema,
    UserResponseSchema,
    RefreshTokenSchema
)
from app.utils.auth import TokenManager, PasswordManager, AuthenticationError

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    try:
        data = UserRegisterSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400

    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409

    try:
        # Create new user
        user = User(
            email=data['email'],
            username=data['username'],
            password_hash=PasswordManager.hash_password(data['password']),
            first_name=data.get('first_name'),
            last_name=data.get('last_name')
        )
        
        db.session.add(user)
        db.session.commit()

        # Generate tokens
        tokens = TokenManager.create_tokens(user.id, user.username)

        return jsonify({
            'message': 'User registered successfully',
            'user': UserResponseSchema().dump(user),
            'tokens': tokens
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return tokens."""
    try:
        data = UserLoginSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not PasswordManager.verify_password(data['password'], user.password_hash):
        return jsonify({'error': 'Invalid email or password'}), 401

    if not user.is_active:
        return jsonify({'error': 'User account is inactive'}), 403

    try:
        tokens = TokenManager.create_tokens(user.id, user.username)
        return jsonify({
            'message': 'Login successful',
            'user': UserResponseSchema().dump(user),
            'tokens': tokens
        }), 200
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500


@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """Refresh access token using refresh token."""
    try:
        data = RefreshTokenSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400

    try:
        payload = TokenManager.verify_token(data['refresh_token'], token_type='refresh')
        user = User.query.get(payload['user_id'])

        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 401

        tokens = TokenManager.create_tokens(user.id, user.username)
        return jsonify({'tokens': tokens}), 200

    except AuthenticationError as e:
        return jsonify({'error': str(e)}), 401
    except Exception as e:
        return jsonify({'error': 'Token refresh failed', 'details': str(e)}), 500
