/**
 * Main application entry point
 */
import './styles.css';
import api from './api';

// Application state
const state = {
  isAuthenticated: false,
  currentUser: null as any,
  projects: [] as any[],
  selectedProject: null as any,
  tasks: [] as any[],
};

// Initialize app
async function init() {
  try {
    await api.healthCheck();
    console.log('Backend is healthy');

    // Check if user is already logged in
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      state.isAuthenticated = true;
      await loadProjects();
      showDashboard();
    } else {
      showLoginPage();
    }
  } catch (error) {
    console.error('Failed to connect to backend', error);
    showLoginPage();
  }
}

// UI Functions
function showLoginPage() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Task Management System</h1>
        <ul class="nav-tabs">
          <li><button class="tab-btn active" data-tab="login">Login</button></li>
          <li><button class="tab-btn" data-tab="register">Register</button></li>
        </ul>

        <form id="loginForm" class="auth-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>

        <form id="registerForm" class="auth-form" style="display: none;">
          <input type="email" placeholder="Email" required />
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password (min 8 chars)" required />
          <input type="text" placeholder="First Name (optional)" />
          <input type="text" placeholder="Last Name (optional)" />
          <button type="submit">Register</button>
        </form>

        <div id="authError" class="error-message"></div>
      </div>
    </div>
  `;

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).getAttribute('data-tab');
      document.querySelectorAll('.auth-form').forEach((form) => {
        form.style.display = 'none';
      });
      document.querySelectorAll('.tab-btn').forEach((b) => {
        b.classList.remove('active');
      });
      document.getElementById(`${target}Form`)!.style.display = 'block';
      (e.target as HTMLElement).classList.add('active');
    });
  });

  // Login handler
  document.getElementById('loginForm')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputs = (e.target as HTMLFormElement).querySelectorAll('input');
    const email = inputs[0].value;
    const password = inputs[1].value;

    try {
      await api.login(email, password);
      state.isAuthenticated = true;
      await loadProjects();
      showDashboard();
    } catch (error) {
      document.getElementById('authError')!.textContent = 'Login failed: ' + (error as any).message;
    }
  });

  // Register handler
  document.getElementById('registerForm')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputs = (e.target as HTMLFormElement).querySelectorAll('input');
    const email = inputs[0].value;
    const username = inputs[1].value;
    const password = inputs[2].value;
    const firstName = inputs[3].value;
    const lastName = inputs[4].value;

    try {
      await api.register(email, username, password, firstName, lastName);
      state.isAuthenticated = true;
      await loadProjects();
      showDashboard();
    } catch (error) {
      document.getElementById('authError')!.textContent = 'Registration failed: ' + (error as any).message;
    }
  });
}

function showDashboard() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Task Management</h1>
        <button id="logoutBtn" class="btn-logout">Logout</button>
      </header>

      <main class="dashboard-content">
        <aside class="sidebar">
          <div class="sidebar-section">
            <h3>Projects</h3>
            <ul id="projectsList" class="projects-list"></ul>
            <button id="newProjectBtn" class="btn-primary">+ New Project</button>
          </div>
        </aside>

        <section class="main-content">
          <div id="projectView" style="display: none;">
            <h2 id="projectTitle"></h2>
            <button id="newTaskBtn" class="btn-primary">+ Add Task</button>
            <ul id="tasksList" class="tasks-list"></ul>
          </div>
          <div id="emptyView" class="empty-state">
            <p>Select a project to view tasks</p>
          </div>
        </section>
      </main>
    </div>

    <div id="modalOverlay" class="modal-overlay" style="display: none;"></div>
  `;

  // Event listeners
  document.getElementById('logoutBtn')!.addEventListener('click', () => {
    api.logout();
    state.isAuthenticated = false;
    state.projects = [];
    state.selectedProject = null;
    showLoginPage();
  });

  document.getElementById('newProjectBtn')!.addEventListener('click', showNewProjectModal);
  
  const newTaskBtn = document.getElementById('newTaskBtn');
  if (newTaskBtn) {
    newTaskBtn.addEventListener('click', showNewTaskModal);
  }
  
  renderProjects();
}

async function loadProjects() {
  try {
    const result = await api.getProjects();
    state.projects = result.projects;
  } catch (error) {
    console.error('Failed to load projects', error);
  }
}

function renderProjects() {
  const projectsList = document.getElementById('projectsList')!;
  projectsList.innerHTML = state.projects
    .map(
      (p) => `
    <li class="project-item" data-id="${p.id}">
      <span>${p.name}</span>
      <button class="btn-delete" onclick="deleteProject(${p.id})">✕</button>
    </li>
  `
    )
    .join('');

  document.querySelectorAll('.project-item').forEach((item) => {
    item.addEventListener('click', async (e) => {
      if ((e.target as HTMLElement).classList.contains('btn-delete')) return;
      const projectId = parseInt((item as HTMLElement).getAttribute('data-id')!);
      await selectProject(projectId);
    });
  });
}

async function selectProject(projectId: number) {
  try {
    const result = await api.getProject(projectId);
    state.selectedProject = result.project;
    const tasksResult = await api.getProjectTasks(projectId);
    state.tasks = tasksResult.tasks;
    renderSelectedProject();
  } catch (error) {
    console.error('Failed to load project', error);
  }
}

function renderSelectedProject() {
  if (!state.selectedProject) return;

  document.getElementById('emptyView')!.style.display = 'none';
  document.getElementById('projectView')!.style.display = 'block';
  document.getElementById('projectTitle')!.textContent = state.selectedProject.name;

  const tasksList = document.getElementById('tasksList')!;
  tasksList.innerHTML = state.tasks
    .map(
      (t) => `
    <li class="task-item" data-id="${t.id}">
      <input type="checkbox" ${t.status === 'completed' ? 'checked' : ''} 
             onchange="updateTaskStatus(${t.id}, this.checked)" />
      <span class="task-title">${t.title}</span>
      <span class="task-priority priority-${t.priority}">${t.priority}</span>
      <button class="btn-delete" onclick="deleteTask(${t.id})">✕</button>
    </li>
  `
    )
    .join('');
}

function showNewProjectModal() {
  const modal = createModal('New Project', `
    <input type="text" id="projectName" placeholder="Project name" />
    <textarea id="projectDesc" placeholder="Description (optional)"></textarea>
  `);

  const buttons = modal.querySelector('.modal-buttons')!;
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn-secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', closeModal);

  const createBtn = document.createElement('button');
  createBtn.className = 'btn-primary';
  createBtn.textContent = 'Create';
  createBtn.addEventListener('click', createNewProject);

  buttons.appendChild(cancelBtn);
  buttons.appendChild(createBtn);
}

function showNewTaskModal() {
  const modal = createModal('New Task', `
    <input type="text" id="taskTitle" placeholder="Task title" />
    <textarea id="taskDescription" placeholder="Description (optional)"></textarea>
    <select id="taskPriority">
      <option value="low">Low Priority</option>
      <option value="medium" selected>Medium Priority</option>
      <option value="high">High Priority</option>
    </select>
  `);

  const buttons = modal.querySelector('.modal-buttons')!;
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn-secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', closeModal);

  const createBtn = document.createElement('button');
  createBtn.className = 'btn-primary';
  createBtn.textContent = 'Create Task';
  createBtn.addEventListener('click', createNewTask);

  buttons.appendChild(cancelBtn);
  buttons.appendChild(createBtn);
}

function createModal(title: string, content: string): HTMLElement {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>${title}</h2>
      ${content}
      <div class="modal-buttons"></div>
    </div>
  `;

  const overlay = document.getElementById('modalOverlay')!;
  overlay.style.display = 'block';
  overlay.onclick = closeModal;
  document.body.appendChild(modal);

  return modal;
}

function closeModal() {
  document.querySelector('.modal')?.remove();
  document.getElementById('modalOverlay')!.style.display = 'none';
}

async function createNewProject() {
  const name = (document.getElementById('projectName') as HTMLInputElement).value;
  const description = (document.getElementById('projectDesc') as HTMLTextAreaElement).value;

  if (!name.trim()) {
    alert('Please enter a project name');
    return;
  }

  try {
    await api.createProject(name, description);
    closeModal();
    await loadProjects();
    renderProjects();
  } catch (error) {
    alert('Failed to create project: ' + (error as any).message);
  }
}

async function createNewTask() {
  const title = (document.getElementById('taskTitle') as HTMLInputElement).value;
  const description = (document.getElementById('taskDescription') as HTMLTextAreaElement).value;
  const priority = (document.getElementById('taskPriority') as HTMLSelectElement).value as string;

  if (!title.trim()) {
    alert('Please enter a task title');
    return;
  }

  if (!state.selectedProject) {
    alert('Please select a project first');
    return;
  }

  try {
    await api.createTask(state.selectedProject.id, title, description || undefined, undefined, priority);
    closeModal();
    const tasksResult = await api.getProjectTasks(state.selectedProject.id);
    state.tasks = tasksResult.tasks;
    renderSelectedProject();
  } catch (error) {
    alert('Failed to create task: ' + (error as any).message);
  }
}

async function deleteProject(projectId: number) {
  if (!confirm('Delete this project and all its tasks?')) return;

  try {
    await api.deleteProject(projectId);
    await loadProjects();
    renderProjects();
    state.selectedProject = null;
    document.getElementById('projectView')!.style.display = 'none';
    document.getElementById('emptyView')!.style.display = 'block';
  } catch (error) {
    alert('Failed to delete project: ' + (error as any).message);
  }
}

async function deleteTask(taskId: number) {
  if (!confirm('Delete this task?')) return;

  try {
    await api.deleteTask(taskId);
    state.tasks = state.tasks.filter((t) => t.id !== taskId);
    renderSelectedProject();
  } catch (error) {
    alert('Failed to delete task: ' + (error as any).message);
  }
}

async function updateTaskStatus(taskId: number, isCompleted: boolean) {
  try {
    await api.updateTask(taskId, undefined, undefined, isCompleted ? 'completed' : 'todo');
    const task = state.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = isCompleted ? 'completed' : 'todo';
    }
  } catch (error) {
    alert('Failed to update task: ' + (error as any).message);
  }
}

// Initialize app on load
init();
