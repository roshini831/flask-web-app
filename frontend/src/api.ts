/**
 * API client for Flask backend communication
 */
import axios, { AxiosInstance, AxiosError } from 'axios';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
  status: string;
  task_count: number;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  project_id: number;
  assignee_id?: number;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string = '') {
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

  private loadTokens(): void {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      const parsed = JSON.parse(tokens);
      this.accessToken = parsed.access_token;
      this.refreshToken = parsed.refresh_token;
    }
  }

  private saveTokens(tokens: AuthTokens): void {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('tokens');
  }

  // Auth endpoints
  async register(
    email: string,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<{ user: User; tokens: AuthTokens }> {
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

  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.client.post('/api/auth/login', { email, password });
    this.saveTokens(response.data.tokens);
    return response.data;
  }

  async logout(): Promise<void> {
    this.clearTokens();
  }

  async refreshAccessToken(): Promise<AuthTokens> {
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
  async getProjects(page: number = 1, perPage: number = 10): Promise<{
    projects: Project[];
    total: number;
    pages: number;
    current_page: number;
  }> {
    try {
      const response = await this.client.get('/api/projects', {
        params: { page, per_page: perPage },
      });
      return response.data;
    } catch (error: any) {
      console.error('getProjects error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getProject(id: number): Promise<{ project: Project }> {
    const response = await this.client.get(`/api/projects/${id}`);
    return response.data;
  }

  async createProject(name: string, description?: string): Promise<{ project: Project }> {
    try {
      console.log('Creating project with:', { name, description, token: this.accessToken?.substring(0, 20) });
      const response = await this.client.post('/api/projects', { name, description });
      console.log('Project created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('createProject error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || error.message || 'Failed to create project');
    }
  }

  async updateProject(
    id: number,
    name?: string,
    description?: string,
    status?: string
  ): Promise<{ project: Project }> {
    const response = await this.client.put(`/api/projects/${id}`, {
      name,
      description,
      status,
    });
    return response.data;
  }

  async deleteProject(id: number): Promise<{ message: string }> {
    const response = await this.client.delete(`/api/projects/${id}`);
    return response.data;
  }

  // Task endpoints
  async getProjectTasks(
    projectId: number,
    status?: string,
    priority?: string
  ): Promise<{ tasks: Task[] }> {
    const response = await this.client.get(`/api/tasks/project/${projectId}`, {
      params: { status, priority },
    });
    return response.data;
  }

  async getTask(id: number): Promise<{ task: Task }> {
    const response = await this.client.get(`/api/tasks/${id}`);
    return response.data;
  }

  async createTask(
    projectId: number,
    title: string,
    description?: string,
    assigneeId?: number,
    priority?: string
  ): Promise<{ task: Task }> {
    const response = await this.client.post(`/api/tasks/project/${projectId}`, {
      title,
      description,
      assignee_id: assigneeId,
      priority,
    });
    return response.data;
  }

  async updateTask(
    id: number,
    title?: string,
    description?: string,
    status?: string,
    priority?: string,
    assigneeId?: number
  ): Promise<{ task: Task }> {
    const response = await this.client.put(`/api/tasks/${id}`, {
      title,
      description,
      status,
      priority,
      assignee_id: assigneeId,
    });
    return response.data;
  }

  async deleteTask(id: number): Promise<{ message: string }> {
    const response = await this.client.delete(`/api/tasks/${id}`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await this.client.get('/api/health');
    return response.data;
  }
}

export { ApiClient, AuthTokens, User, Project, Task };
export default new ApiClient();
