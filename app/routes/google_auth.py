from flask import Blueprint, redirect, request, jsonify, current_app
from google_auth_oauthlib.flow import Flow
from app.models import db, User
from app.utils.auth import token_required
import os
import json

google_auth_bp = Blueprint('google_auth', __name__, url_prefix='/api/auth/google')

@google_auth_bp.route('/connect', methods=['GET'])
@token_required
def connect_google():
    """Initiate Google OAuth flow."""
    # Allow HTTP for local development
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    
    current_user = User.query.get(request.user_id)
    if not current_user:
        return jsonify({'error': 'User not found'}), 404

    # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.
    flow = Flow.from_client_config(
        client_config={
            "web": {
                "client_id": current_app.config['GOOGLE_CLIENT_ID'],
                "client_secret": current_app.config['GOOGLE_CLIENT_SECRET'],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=['https://www.googleapis.com/auth/calendar.events'],
        redirect_uri=current_app.config['GOOGLE_REDIRECT_URI']
    )

    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        state=str(current_user.id)  # Pass user ID as state to identify user in callback
    )

    return jsonify({'authorization_url': authorization_url})

@google_auth_bp.route('/callback', methods=['GET'])
def google_callback():
    """Handle Google OAuth callback."""
    # Allow HTTP for local development
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    
    state = request.args.get('state')
    if not state:
        return jsonify({'error': 'Missing state parameter'}), 400
        
    user_id = int(state)
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    flow = Flow.from_client_config(
        client_config={
            "web": {
                "client_id": current_app.config['GOOGLE_CLIENT_ID'],
                "client_secret": current_app.config['GOOGLE_CLIENT_SECRET'],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=['https://www.googleapis.com/auth/calendar.events'],
        redirect_uri=current_app.config['GOOGLE_REDIRECT_URI']
    )

    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials

    # Save credentials to user
    user.google_credentials = credentials.to_json()
    db.session.commit()

    # Redirect to frontend
    return redirect('http://localhost:3000/settings?google_connected=true')
