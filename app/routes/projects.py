"""Project routes for CRUD operations."""
from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.models import db, Project, User
from app.schemas import (
    ProjectCreateSchema,
    ProjectUpdateSchema,
    ProjectResponseSchema
)
from app.utils.auth import token_required

projects_bp = Blueprint('projects', __name__, url_prefix='/api/projects')


@projects_bp.route('', methods=['GET'])
@token_required
def get_projects():
    """Get all projects for the authenticated user."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        projects = Project.query.filter_by(owner_id=request.user_id).paginate(
            page=page, per_page=per_page
        )

        return jsonify({
            'projects': ProjectResponseSchema(many=True).dump(projects.items),
            'total': projects.total,
            'pages': projects.pages,
            'current_page': page
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch projects', 'details': str(e)}), 500


@projects_bp.route('/<int:project_id>', methods=['GET'])
@token_required
def get_project(project_id):
    """Get a specific project by ID."""
    try:
        project = Project.query.filter_by(
            id=project_id,
            owner_id=request.user_id
        ).first()

        if not project:
            return jsonify({'error': 'Project not found'}), 404

        return jsonify({
            'project': ProjectResponseSchema().dump(project)
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch project', 'details': str(e)}), 500


@projects_bp.route('', methods=['POST'])
@token_required
def create_project():
    """Create a new project."""
    try:
        data = ProjectCreateSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400

    try:
        project = Project(
            name=data['name'],
            description=data.get('description'),
            owner_id=request.user_id
        )

        db.session.add(project)
        db.session.commit()

        return jsonify({
            'message': 'Project created successfully',
            'project': ProjectResponseSchema().dump(project)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create project', 'details': str(e)}), 500


@projects_bp.route('/<int:project_id>', methods=['PUT'])
@token_required
def update_project(project_id):
    """Update an existing project."""
    try:
        data = ProjectUpdateSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400

    try:
        project = Project.query.filter_by(
            id=project_id,
            owner_id=request.user_id
        ).first()

        if not project:
            return jsonify({'error': 'Project not found'}), 404

        # Update fields
        if 'name' in data:
            project.name = data['name']
        if 'description' in data:
            project.description = data['description']
        if 'status' in data:
            project.status = data['status']

        db.session.commit()

        return jsonify({
            'message': 'Project updated successfully',
            'project': ProjectResponseSchema().dump(project)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update project', 'details': str(e)}), 500


@projects_bp.route('/<int:project_id>', methods=['DELETE'])
@token_required
def delete_project(project_id):
    """Delete a project."""
    try:
        project = Project.query.filter_by(
            id=project_id,
            owner_id=request.user_id
        ).first()

        if not project:
            return jsonify({'error': 'Project not found'}), 404

        db.session.delete(project)
        db.session.commit()

        return jsonify({'message': 'Project deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete project', 'details': str(e)}), 500
