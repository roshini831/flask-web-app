"""Pytest configuration and fixtures."""
import sys
from pathlib import Path

# Add the project root to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from app import create_app
from app.models import db, User, Project, Task
from app.utils.auth import PasswordManager


@pytest.fixture
def app():
    """Create and configure a test app."""
    app = create_app('testing')

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's CLI commands."""
    return app.test_cli_runner()


@pytest.fixture
def test_user(app):
    """Create a test user."""
    user = User(
        email='test@example.com',
        username='testuser',
        password_hash=PasswordManager.hash_password('password123'),
        first_name='Test',
        last_name='User'
    )
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def test_project(app, test_user):
    """Create a test project."""
    project = Project(
        name='Test Project',
        description='A test project',
        owner_id=test_user.id
    )
    db.session.add(project)
    db.session.commit()
    return project


@pytest.fixture
def test_task(app, test_project):
    """Create a test task."""
    task = Task(
        title='Test Task',
        description='A test task',
        project_id=test_project.id,
        status='todo',
        priority='medium'
    )
    db.session.add(task)
    db.session.commit()
    return task


@pytest.fixture
def auth_headers(client, test_user):
    """Get authentication headers with valid token."""
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    tokens = response.get_json()['tokens']
    return {'Authorization': f"Bearer {tokens['access_token']}"}
