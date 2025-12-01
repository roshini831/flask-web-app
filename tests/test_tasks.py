"""Task endpoint tests."""
import pytest


class TestTaskEndpoints:
    """Test task endpoints."""

    def test_get_project_tasks(self, client, auth_headers, test_project, test_task):
        """Test fetching tasks for a project."""
        response = client.get(f'/api/tasks/project/{test_project.id}', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert 'tasks' in data
        assert len(data['tasks']) > 0

    def test_get_task_detail(self, client, auth_headers, test_task):
        """Test fetching a specific task."""
        response = client.get(f'/api/tasks/{test_task.id}', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['task']['title'] == 'Test Task'

    def test_create_task(self, client, auth_headers, test_project):
        """Test creating a task."""
        response = client.post(f'/api/tasks/project/{test_project.id}',
            headers=auth_headers,
            json={
                'title': 'New Task',
                'description': 'A new task',
                'priority': 'high'
            }
        )

        assert response.status_code == 201
        data = response.get_json()
        assert data['task']['title'] == 'New Task'
        assert data['task']['priority'] == 'high'

    def test_update_task(self, client, auth_headers, test_task):
        """Test updating a task."""
        response = client.put(f'/api/tasks/{test_task.id}',
            headers=auth_headers,
            json={
                'status': 'in_progress',
                'priority': 'low'
            }
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['task']['status'] == 'in_progress'
        assert data['task']['priority'] == 'low'

    def test_delete_task(self, client, auth_headers, test_task):
        """Test deleting a task."""
        response = client.delete(f'/api/tasks/{test_task.id}', headers=auth_headers)

        assert response.status_code == 200

        # Verify task is deleted
        get_response = client.get(f'/api/tasks/{test_task.id}', headers=auth_headers)
        assert get_response.status_code == 404

    def test_task_without_auth(self, client, test_project):
        """Test accessing tasks without authentication."""
        response = client.get(f'/api/tasks/project/{test_project.id}')

        assert response.status_code == 401
