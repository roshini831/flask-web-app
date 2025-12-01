"""Flask application factory."""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from config.config import config
from app.models import db
from app.routes.auth import auth_bp
from app.routes.projects import projects_bp
from app.routes.tasks import tasks_bp
from app.routes.health import health_bp


def create_app(config_name: str = None):
    """Create and configure Flask application."""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    CORS(app)
    migrate = Migrate(app, db)

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(projects_bp)
    app.register_blueprint(tasks_bp)

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({'error': 'Method not allowed'}), 405

    # Create tables
    with app.app_context():
        db.create_all()

    return app
