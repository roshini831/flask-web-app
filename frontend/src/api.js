/**
 * API client for Flask backend communication
 */
import axios from 'axios';
class ApiClient {
    constructor(baseURL = '') {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "accessToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "refreshToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add request interceptor to include auth token
        this.client.interceptors.request.use((config) => {
            if (this.accessToken) {
                config.headers.Authorization = `Bearer ${this.accessToken}`;
            }
            return config;
        });
        // Load tokens from localStorage
        this.loadTokens();
    }
    loadTokens() {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
            const parsed = JSON.parse(tokens);
            this.accessToken = parsed.access_token;
            this.refreshToken = parsed.refresh_token;
        }
    }
    saveTokens(tokens) {
        this.accessToken = tokens.access_token;
        this.refreshToken = tokens.refresh_token;
        localStorage.setItem('tokens', JSON.stringify(tokens));
    }
    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('tokens');
    }
    // Auth endpoints
    async register(email, username, password, firstName, lastName) {
        const response = await this.client.post('/api/auth/register', {
            email,
            username,
            password,
            first_name: firstName,
            last_name: lastName,
        });
        this.saveTokens(response.data.tokens);
        return response.data;
    }
    async login(email, password) {
        const response = await this.client.post('/api/auth/login', { email, password });
        this.saveTokens(response.data.tokens);
        return response.data;
    }
    async logout() {
        this.clearTokens();
    }
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }
        const response = await this.client.post('/api/auth/refresh', {
            refresh_token: this.refreshToken,
        });
        this.saveTokens(response.data.tokens);
        return response.data.tokens;
    }
    // Project endpoints
    async getProjects(page = 1, perPage = 10) {
        try {
            const response = await this.client.get('/api/projects', {
                params: { page, per_page: perPage },
            });
            return response.data;
        }
        catch (error) {
            console.error('getProjects error:', error.response?.data || error.message);
            throw error;
        }
    }
    async getProject(id) {
        const response = await this.client.get(`/api/projects/${id}`);
        return response.data;
    }
    async createProject(name, description) {
        try {
            console.log('Creating project with:', { name, description, token: this.accessToken?.substring(0, 20) });
            const response = await this.client.post('/api/projects', { name, description });
            console.log('Project created:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('createProject error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw new Error(error.response?.data?.error || error.message || 'Failed to create project');
        }
    }
    async updateProject(id, name, description, status) {
        const response = await this.client.put(`/api/projects/${id}`, {
            name,
            description,
            status,
        });
        return response.data;
    }
    async deleteProject(id) {
        const response = await this.client.delete(`/api/projects/${id}`);
        return response.data;
    }
    // Task endpoints
    async getProjectTasks(projectId, status, priority) {
        const response = await this.client.get(`/api/tasks/project/${projectId}`, {
            params: { status, priority },
        });
        return response.data;
    }
    async getTask(id) {
        const response = await this.client.get(`/api/tasks/${id}`);
        return response.data;
    }
    async createTask(projectId, title, description, assigneeId, priority, dueDate) {
        const response = await this.client.post(`/api/tasks/project/${projectId}`, {
            title,
            description,
            assignee_id: assigneeId,
            priority,
            due_date: dueDate,
        });
        return response.data;
    }
    async updateTask(id, title, description, status, priority, assigneeId, dueDate) {
        const response = await this.client.put(`/api/tasks/${id}`, {
            title,
            description,
            status,
            priority,
            assignee_id: assigneeId,
            due_date: dueDate,
        });
        return response.data;
    }
    async deleteTask(id) {
        const response = await this.client.delete(`/api/tasks/${id}`);
        return response.data;
    }
    // Health check
    async healthCheck() {
        const response = await this.client.get('/api/health');
        return response.data;
    }
    // Google Calendar
    async connectGoogleCalendar() {
        const response = await this.client.get('/api/auth/google/connect');
        return response.data;
    }
}
export { ApiClient };
export default new ApiClient();
