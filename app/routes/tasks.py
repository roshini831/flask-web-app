"""Task routes for CRUD operations."""
from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.models import db, Task, Project
from app.schemas import (
    TaskCreateSchema,
    TaskUpdateSchema,
    TaskResponseSchema
)
from app.utils.auth import token_required
from app.utils.google_calendar import (
    create_calendar_event,
    update_calendar_event,
    delete_calendar_event
)
from app.models import User

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')


@tasks_bp.route('/project/<int:project_id>', methods=['GET'])
@token_required
def get_project_tasks(project_id):
    """Get all tasks for a specific project."""
    try:
        # Verify user owns the project
        project = Project.query.filter_by(
            id=project_id,
            owner_id=request.user_id
        ).first()

        if not project:
            return jsonify({'error': 'Project not found'}), 404

        status = request.args.get('status')
        priority = request.args.get('priority')

        query = Task.query.filter_by(project_id=project_id)

        if status:
            query = query.filter_by(status=status)
        if priority:
            query = query.filter_by(priority=priority)

        tasks = query.all()

        return jsonify({
            'tasks': TaskResponseSchema(many=True).dump(tasks)
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch tasks', 'details': str(e)}), 500


@tasks_bp.route('/<int:task_id>', methods=['GET'])
@token_required
def get_task(task_id):
    """Get a specific task."""
    try:
        task = Task.query.get(task_id)

        if not task:
            return jsonify({'error': 'Task not found'}), 404

        # Verify user owns the project
        project = Project.query.filter_by(
            id=task.project_id,
            owner_id=request.user_id
        ).first()

        if not project:
            return jsonify({'error': 'Unauthorized'}), 403

        return jsonify({
            'task': TaskResponseSchema().dump(task)
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch task', 'details': str(e)}), 500


@tasks_bp.route('/project/<int:project_id>', methods=['POST'])
@token_required
def create_task(project_id):
    """Create a new task for a project."""
    try:
        data = TaskCreateSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400

    try:
        # Verify user owns the project
        project = Project.query.filter_by(
            id=project_id,
            owner_id=request.user_id
        ).first()

        if not project:
            return jsonify({'error': 'Project not found'}), 404

        task = Task(
            title=data['title'],
            description=data.get('description'),
            project_id=project_id,
            assignee_id=data.get('assignee_id'),
            priority=data.get('priority', 'medium'),
            due_date=data.get('due_date')
        )

        db.session.add(task)
        db.session.commit()
        
        # Sync with Google Calendar
        user = User.query.get(request.user_id)
        if user and task.due_date:
            event_id = create_calendar_event(user, task)
            if event_id:
                task.google_event_id = event_id
                db.session.commit()

        return jsonify({
            'message': 'Task created successfully',
            'task': TaskResponseSchema().dump(task)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create task', 'details': str(e)}), 500


@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@token_required
def update_task(task_id):
    """Update an existing task."""
    try:
        data = TaskUpdateSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'messages': err.messages}), 400

    try:
        task = Task.query.get(task_id)

        if not task:
            return jsonify({'error': 'Task not found'}), 404

        # Verify user owns the project
        project = Project.query.filter_by(
            id=task.project_id,
            owner_id=request.user_id
        ).first()

        if not project:
            return jsonify({'error': 'Unauthorized'}), 403

        # Update fields
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'status' in data:
            task.status = data['status']
        if 'priority' in data:
            task.priority = data['priority']
        if 'assignee_id' in data:
            task.assignee_id = data['assignee_id']
        if 'due_date' in data:
            task.due_date = data['due_date']

        db.session.commit()
        
        # Sync with Google Calendar
        user = User.query.get(request.user_id)
        if user:
            update_calendar_event(user, task)

        return jsonify({
            'message': 'Task updated successfully',
            'task': TaskResponseSchema().dump(task)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update task', 'details': str(e)}), 500


@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@token_required
def delete_task(task_id):
    """Delete a task."""
    try:
        task = Task.query.get(task_id)

        if not task:
            return jsonify({'error': 'Task not found'}), 404

        # Verify user owns the project
        project = Project.query.filter_by(
            id=task.project_id,
            owner_id=request.user_id
        ).first()

        if not project:
            return jsonify({'error': 'Unauthorized'}), 403

        db.session.delete(task)
        db.session.commit()
        
        # Sync with Google Calendar
        user = User.query.get(request.user_id)
        if user:
            delete_calendar_event(user, task)

        return jsonify({'message': 'Task deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete task', 'details': str(e)}), 500
