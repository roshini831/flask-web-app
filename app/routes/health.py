"""Health check and API documentation routes."""
from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__, url_prefix='/api')


@health_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'message': 'API is running'
    }), 200


@health_bp.route('/docs', methods=['GET'])
def api_docs():
    """API documentation."""
    return jsonify({
        'title': 'Flask Task Management API',
        'version': '1.0.0',
        'description': 'A comprehensive REST API for task and project management',
        'endpoints': {
            'authentication': {
                'POST /api/auth/register': 'Register a new user',
                'POST /api/auth/login': 'Login and get tokens',
                'POST /api/auth/refresh': 'Refresh access token'
            },
            'projects': {
                'GET /api/projects': 'Get all user projects',
                'GET /api/projects/<id>': 'Get a specific project',
                'POST /api/projects': 'Create a new project',
                'PUT /api/projects/<id>': 'Update a project',
                'DELETE /api/projects/<id>': 'Delete a project'
            },
            'tasks': {
                'GET /api/tasks/project/<project_id>': 'Get tasks for a project',
                'GET /api/tasks/<id>': 'Get a specific task',
                'POST /api/tasks/project/<project_id>': 'Create a new task',
                'PUT /api/tasks/<id>': 'Update a task',
                'DELETE /api/tasks/<id>': 'Delete a task'
            }
        }
    }), 200
