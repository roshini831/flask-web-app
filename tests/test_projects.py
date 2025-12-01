"""Project endpoint tests."""
import pytest


class TestProjectEndpoints:
    """Test project endpoints."""

    def test_get_projects(self, client, auth_headers, test_project):
        """Test fetching projects."""
        response = client.get('/api/projects', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert 'projects' in data
        assert len(data['projects']) > 0

    def test_get_project_detail(self, client, auth_headers, test_project):
        """Test fetching a specific project."""
        response = client.get(f'/api/projects/{test_project.id}', headers=auth_headers)

        assert response.status_code == 200
        data = response.get_json()
        assert data['project']['name'] == 'Test Project'

    def test_get_nonexistent_project(self, client, auth_headers):
        """Test fetching nonexistent project."""
        response = client.get('/api/projects/999', headers=auth_headers)

        assert response.status_code == 404

    def test_create_project(self, client, auth_headers):
        """Test creating a project."""
        response = client.post('/api/projects', 
            headers=auth_headers,
            json={
                'name': 'New Project',
                'description': 'A new project'
            }
        )

        assert response.status_code == 201
        data = response.get_json()
        assert data['project']['name'] == 'New Project'

    def test_update_project(self, client, auth_headers, test_project):
        """Test updating a project."""
        response = client.put(f'/api/projects/{test_project.id}',
            headers=auth_headers,
            json={
                'name': 'Updated Project',
                'status': 'completed'
            }
        )

        assert response.status_code == 200
        data = response.get_json()
        assert data['project']['name'] == 'Updated Project'
        assert data['project']['status'] == 'completed'

    def test_delete_project(self, client, auth_headers, test_project):
        """Test deleting a project."""
        response = client.delete(f'/api/projects/{test_project.id}', headers=auth_headers)

        assert response.status_code == 200

        # Verify project is deleted
        get_response = client.get(f'/api/projects/{test_project.id}', headers=auth_headers)
        assert get_response.status_code == 404

    def test_project_without_auth(self, client):
        """Test accessing projects without authentication."""
        response = client.get('/api/projects')

        assert response.status_code == 401
