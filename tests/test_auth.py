"""Authentication endpoint tests."""
import pytest
import json


class TestAuthEndpoints:
    """Test authentication endpoints."""

    def test_register_success(self, client):
        """Test successful user registration."""
        response = client.post('/api/auth/register', json={
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'password123',
            'first_name': 'New',
            'last_name': 'User'
        })

        assert response.status_code == 201
        data = response.get_json()
        assert 'tokens' in data
        assert data['user']['email'] == 'newuser@example.com'

    def test_register_duplicate_email(self, client, test_user):
        """Test registration with duplicate email."""
        response = client.post('/api/auth/register', json={
            'email': 'test@example.com',
            'username': 'differentuser',
            'password': 'password123'
        })

        assert response.status_code == 409

    def test_register_invalid_password(self, client):
        """Test registration with invalid password."""
        response = client.post('/api/auth/register', json={
            'email': 'user@example.com',
            'username': 'user',
            'password': 'short'
        })

        assert response.status_code == 400

    def test_login_success(self, client, test_user):
        """Test successful login."""
        response = client.post('/api/auth/login', json={
            'email': 'test@example.com',
            'password': 'password123'
        })

        assert response.status_code == 200
        data = response.get_json()
        assert 'tokens' in data
        assert 'access_token' in data['tokens']

    def test_login_invalid_credentials(self, client, test_user):
        """Test login with invalid credentials."""
        response = client.post('/api/auth/login', json={
            'email': 'test@example.com',
            'password': 'wrongpassword'
        })

        assert response.status_code == 401

    def test_login_nonexistent_user(self, client):
        """Test login for nonexistent user."""
        response = client.post('/api/auth/login', json={
            'email': 'nonexistent@example.com',
            'password': 'password123'
        })

        assert response.status_code == 401

    def test_refresh_token(self, client, test_user):
        """Test token refresh."""
        # Login to get tokens
        login_response = client.post('/api/auth/login', json={
            'email': 'test@example.com',
            'password': 'password123'
        })
        tokens = login_response.get_json()['tokens']

        # Refresh token
        response = client.post('/api/auth/refresh', json={
            'refresh_token': tokens['refresh_token']
        })

        assert response.status_code == 200
        data = response.get_json()
        assert 'tokens' in data
        assert 'access_token' in data['tokens']
