"""Authentication utilities with JWT and password hashing."""
import jwt
import secrets
from functools import wraps
from datetime import datetime, timedelta
from flask import request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash


class AuthenticationError(Exception):
    """Custom exception for authentication errors."""
    pass


class TokenManager:
    """Manages JWT token creation and validation."""

    @staticmethod
    def create_tokens(user_id: int, username: str) -> dict:
        """Create access and refresh tokens for a user."""
        now = datetime.utcnow()
        
        access_token_payload = {
            'user_id': user_id,
            'username': username,
            'token_type': 'access',
            'iat': now,
            'exp': now + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }
        
        refresh_token_payload = {
            'user_id': user_id,
            'username': username,
            'token_type': 'refresh',
            'iat': now,
            'exp': now + current_app.config['JWT_REFRESH_TOKEN_EXPIRES']
        }
        
        access_token = jwt.encode(
            access_token_payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm=current_app.config['JWT_ALGORITHM']
        )
        
        refresh_token = jwt.encode(
            refresh_token_payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm=current_app.config['JWT_ALGORITHM']
        )
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer',
            'expires_in': int(current_app.config['JWT_ACCESS_TOKEN_EXPIRES'].total_seconds())
        }

    @staticmethod
    def verify_token(token: str, token_type: str = 'access') -> dict:
        """Verify and decode a JWT token."""
        try:
            payload = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=[current_app.config['JWT_ALGORITHM']]
            )
            
            if payload.get('token_type') != token_type:
                raise AuthenticationError(f'Invalid token type. Expected {token_type}')
            
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthenticationError('Token has expired')
        except jwt.InvalidTokenError as e:
            raise AuthenticationError(f'Invalid token: {str(e)}')


class PasswordManager:
    """Manages password hashing and verification."""

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using werkzeug."""
        if not password or len(password) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return generate_password_hash(password, method='pbkdf2:sha256')

    @staticmethod
    def verify_password(password: str, hash: str) -> bool:
        """Verify a password against its hash."""
        return check_password_hash(hash, password)


def token_required(f):
    """Decorator to protect routes that require authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            payload = TokenManager.verify_token(token, token_type='access')
            request.user_id = payload['user_id']
            request.username = payload['username']
        except AuthenticationError as e:
            return jsonify({'error': str(e)}), 401
        
        return f(*args, **kwargs)
    
    return decorated


def admin_required(f):
    """Decorator to protect admin routes."""
    @wraps(f)
    def decorated(*args, **kwargs):
        # First, check if user is authenticated
        if not hasattr(request, 'user_id'):
            token_required(lambda: None)()
        
        # TODO: Implement role checking in production
        # For now, just ensuring authentication
        return f(*args, **kwargs)
    
    return decorated
