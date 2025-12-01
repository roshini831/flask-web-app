# Architecture & Design Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Browser                           │
│         (TypeScript/Vite Frontend - SPA)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST + JWT Tokens
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Flask REST API (Python)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication Layer (JWT, Password Hashing)        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Route Handlers (Auth, Projects, Tasks, Health)      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Request Validation (Marshmallow Schemas)            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SQLAlchemy ORM Layer (Models & Queries)             │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL Queries
                       │
┌──────────────────────▼──────────────────────────────────────┐
│          SQLite/MySQL Database                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  Users   │  │ Projects │  │  Tasks   │                   │
│  │  Table   │  │  Table   │  │  Table   │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture (Flask)

### Layered Architecture

```
┌─────────────────────────────────────┐
│      HTTP Request/Response          │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│   Route Layer (app/routes/)          │
│   ├─ auth.py (Register, Login)       │
│   ├─ projects.py (CRUD)              │
│   ├─ tasks.py (CRUD)                 │
│   └─ health.py (Status)              │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│   Request Validation Layer           │
│   (app/schemas/ - Marshmallow)       │
│   ├─ User Schemas                    │
│   ├─ Project Schemas                 │
│   ├─ Task Schemas                    │
│   └─ Token Schemas                   │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│   Business Logic & Auth Utils        │
│   (app/utils/)                       │
│   ├─ auth.py (JWT, Passwords)        │
│   └─ helpers.py (Utilities)          │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│   Data Layer (app/models/)           │
│   ├─ User Model                      │
│   ├─ Project Model                   │
│   ├─ Task Model                      │
│   └─ SQLAlchemy ORM                  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│   Database (SQLite/MySQL)            │
└─────────────────────────────────────┘
```

### Key Components

#### 1. Route Handlers (app/routes/)

**Purpose**: Process HTTP requests and return responses

**auth.py**
```
POST /api/auth/register → Create user → Generate tokens
POST /api/auth/login    → Verify credentials → Generate tokens
POST /api/auth/refresh  → Validate refresh token → New access token
```

**projects.py**
```
GET    /api/projects              → List user's projects (paginated)
GET    /api/projects/<id>         → Get single project
POST   /api/projects              → Create new project
PUT    /api/projects/<id>         → Update project
DELETE /api/projects/<id>         → Delete project
```

**tasks.py**
```
GET    /api/tasks/project/<id>    → List project tasks (filtered)
GET    /api/tasks/<id>            → Get single task
POST   /api/tasks/project/<id>    → Create task
PUT    /api/tasks/<id>            → Update task
DELETE /api/tasks/<id>            → Delete task
```

#### 2. Models (app/models/__init__.py)

**User Model**
- Fields: id, email, username, password_hash, names, timestamps, is_active
- Relationships: projects (owner), tasks (assignee)
- Methods: to_dict() for serialization

**Project Model**
- Fields: id, name, description, owner_id, status, timestamps
- Relationships: owner (User), tasks (Task)
- Methods: to_dict() for serialization

**Task Model**
- Fields: id, title, description, project_id, assignee_id, status, priority, timestamps
- Relationships: project (Project), assignee (User)
- Methods: to_dict() for serialization

#### 3. Schemas (app/schemas/__init__.py)

**Purpose**: Validate input data and serialize output

```
UserRegisterSchema      → Validate registration input
UserLoginSchema         → Validate login input
UserResponseSchema      → Format user response
ProjectCreateSchema     → Validate project creation
ProjectUpdateSchema     → Validate project updates
ProjectResponseSchema   → Format project response
TaskCreateSchema        → Validate task creation
TaskUpdateSchema        → Validate task updates
TaskResponseSchema      → Format task response
RefreshTokenSchema      → Validate token refresh
```

#### 4. Authentication (app/utils/auth.py)

**TokenManager Class**
- `create_tokens(user_id, username)` → Generate JWT tokens
- `verify_token(token, token_type)` → Validate and decode JWT

**PasswordManager Class**
- `hash_password(password)` → Secure hashing with PBKDF2
- `verify_password(password, hash)` → Compare password with hash

**Decorators**
- `@token_required` → Protect routes, extract user from token
- `@admin_required` → Future role-based access

#### 5. Configuration (config/config.py)

**Three Environment Classes**

```python
DevelopmentConfig
├─ Debug: True
├─ Database: SQLite (app.db)
├─ JWT Expiry: 24h access, 30d refresh
└─ SQLALCHEMY_ECHO: True (log queries)

TestingConfig
├─ Debug: True
├─ Database: In-memory SQLite
├─ Testing: True
└─ SQLALCHEMY_ECHO: False

ProductionConfig
├─ Debug: False
├─ Database: MySQL (from env var)
├─ SQLALCHEMY_ECHO: False
└─ Strict security requirements
```

## Frontend Architecture (TypeScript/Vite)

### File Structure

```
frontend/
├── src/
│   ├── api.ts          # API client (Axios wrapper)
│   ├── main.ts         # Application logic & UI
│   ├── styles.css      # Styling
│   └── (images, assets)
├── public/
│   └── index.html      # HTML entry point
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite configuration
└── README.md          # Frontend documentation
```

### API Client (api.ts)

**Classes & Interfaces**

```typescript
interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface User { id, email, username, ... }
interface Project { id, name, description, ... }
interface Task { id, title, project_id, ... }

class ApiClient {
  // Constructor with Axios configuration
  constructor(baseURL)
  
  // Token management
  private loadTokens()
  private saveTokens(tokens)
  private clearTokens()
  
  // Auth endpoints
  async register(email, username, password, ...)
  async login(email, password)
  async logout()
  async refreshAccessToken()
  
  // Project endpoints
  async getProjects(page, perPage)
  async getProject(id)
  async createProject(name, description)
  async updateProject(id, name, description, status)
  async deleteProject(id)
  
  // Task endpoints
  async getProjectTasks(projectId, status, priority)
  async getTask(id)
  async createTask(projectId, title, description, ...)
  async updateTask(id, title, description, status, ...)
  async deleteTask(id)
  
  // Health
  async healthCheck()
}
```

### Application Logic (main.ts)

**State Management**

```typescript
const state = {
  isAuthenticated: boolean,
  currentUser: User | null,
  projects: Project[],
  selectedProject: Project | null,
  tasks: Task[]
}
```

**Key Functions**

```
init()                          → Initialize app
showLoginPage()                 → Render auth UI
showDashboard()                 → Render app UI
loadProjects()                  → Fetch projects
selectProject(projectId)        → Load project & tasks
renderSelectedProject()         → Display tasks
createNewProject()              → Create project modal
deleteProject(projectId)        → Delete project
deleteTask(taskId)              → Delete task
updateTaskStatus(taskId, bool)  → Mark task complete
```

### UI Components

**Authentication Page**
- Login form
- Register form
- Tab switching
- Error display

**Dashboard**
- Header with logout
- Sidebar with project list
- Main content area for tasks
- Modal for creating projects

## Data Flow Diagrams

### Authentication Flow

```
User Registration:
1. User fills form (email, username, password)
2. Frontend validates input
3. POST /api/auth/register
4. Backend validates with Marshmallow schema
5. Hash password with PBKDF2
6. Create User record
7. Generate JWT tokens
8. Return user + tokens
9. Frontend stores tokens in localStorage
10. Frontend navigates to dashboard

User Login:
1. User enters email & password
2. POST /api/auth/login
3. Backend queries User by email
4. Verify password with stored hash
5. Generate tokens
6. Return user + tokens
7. Frontend stores tokens
8. Frontend adds token to auth header for future requests

Token Refresh:
1. Access token expires
2. Frontend detects 401 error
3. POST /api/auth/refresh with refresh_token
4. Backend validates refresh token
5. Generate new access token
6. Frontend retries original request with new token
```

### Project Creation Flow

```
1. User clicks "New Project"
2. Modal opens with form
3. User enters name & description
4. User clicks "Create"
5. Frontend validates input
6. POST /api/projects with token
7. @token_required decorator validates token
8. Route handler validates with ProjectCreateSchema
9. Create Project model
10. db.session.add() & db.session.commit()
11. Return created project
12. Frontend updates projects list
13. Modal closes
14. Project appears in sidebar
```

### Task Update Flow

```
1. User checks/unchecks task checkbox
2. Frontend calls updateTaskStatus()
3. PUT /api/tasks/<id> with status
4. Token validated via @token_required
5. Fetch Task and verify project ownership
6. Update status field
7. db.session.commit()
8. Return updated task
9. Frontend updates task in state
10. UI re-renders
```

## Security Architecture

### Authentication Strategy

```
Password Storage:
plaintext → PBKDF2(password, salt, rounds=12) → store_hash

Token Generation:
{user_id, username, exp, iat} → JWT_SECRET_KEY → access_token
{user_id, username, exp, iat, type='refresh'} → refresh_token

Request Validation:
GET /api/projects
→ Check Authorization header
→ Extract Bearer token
→ JWT decode with secret
→ Verify exp > now
→ Extract user_id
→ Pass to route handler
```

### Authorization Strategy

```
Resource Access:
1. Route verifies user is authenticated (@token_required)
2. Extract user_id from token
3. Query resource from database
4. Check resource.owner_id == user_id
5. If not owner, return 403 Forbidden
6. If owner, allow operation
```

## Database Relationships

```
┌──────────────┐
│    Users     │
├──────────────┤
│ id (PK)      │
│ email        │
│ username     │
│ password_hash│
│ ...          │
└────┬─────────┘
     │
     ├──1───────────────────────────N──┐
     │ (owner)                         │
     │                        ┌────────▼─────┐
     │                        │ Projects      │
     │                        ├───────────────┤
     │                        │ id (PK)       │
     │                        │ owner_id (FK) │
     │                        │ name          │
     │                        │ description   │
     │                        │ status        │
     │                        │ ...           │
     │                        └────┬──────────┘
     │                             │
     │                             ├──1───────────────┬──N──┐
     │                             │ (project)        │     │
     │                             │            ┌─────▼──────┐
     │                             │            │ Tasks      │
     │                             │            ├────────────┤
     │                             │            │ id (PK)    │
     │                             │            │ project_id │
     │                             │            │ assignee_id│
     │                             │            │ title      │
     │                             │            │ status     │
     │                             │            │ priority   │
     │                             │            │ ...        │
     │                             │            └────┬───────┘
     │                             │                 │
     └─────────────┬──1──────────────────────────N──┘
       (assignee)  │
                   │
```

## API Response Format

### Success Response (2xx)

```json
{
  "message": "Operation successful",
  "data": { /* resource data */ },
  "tokens": { /* if auth endpoint */ }
}
```

### Error Response (4xx, 5xx)

```json
{
  "error": "Human readable error message",
  "messages": { /* validation errors */ },
  "details": "Technical details"
}
```

## Testing Strategy

### Test Pyramid

```
         ▲
        /│\
       / │ \          Integration Tests
      /  │  \         - API endpoints
     /   │   \        - DB interactions
    ╱────┼────╲
   /     │     \      Unit Tests
  /      │      \     - Models
 /       │       \    - Utilities
╱────────┼────────╲
        Base        - Fixtures
                    - Mocks
                    - Setup/Teardown
```

### Test Coverage

```
Fixtures (conftest.py):
├─ app: Test Flask application
├─ client: Test client
├─ test_user: Sample user
├─ test_project: Sample project
├─ test_task: Sample task
└─ auth_headers: Valid auth token

Auth Tests (test_auth.py):
├─ test_register_success
├─ test_register_duplicate_email
├─ test_login_success
├─ test_login_invalid_credentials
└─ test_refresh_token

Project Tests (test_projects.py):
├─ test_get_projects
├─ test_create_project
├─ test_update_project
├─ test_delete_project
└─ test_project_without_auth

Task Tests (test_tasks.py):
├─ test_get_project_tasks
├─ test_create_task
├─ test_update_task
├─ test_delete_task
└─ test_task_without_auth
```

## Deployment Architecture

### Development Environment

```
Local Machine
├─ Backend: python index.py (port 5001)
├─ Frontend: npm run dev (port 3000)
├─ Database: SQLite (app.db)
└─ Environment: .env with dev settings
```

### Production Environment

```
Cloud Server (AWS/GCP/Azure)
├─ Backend Container
│  ├─ Flask App (Gunicorn)
│  ├─ Environment: Docker secrets
│  └─ Port: 5001 (internal)
├─ Frontend Container
│  ├─ Nginx static server
│  ├─ Vite build (dist/)
│  └─ Port: 3000 (internal)
├─ Database: MySQL RDS/Cloud SQL
├─ Load Balancer
│  ├─ HTTPS termination
│  └─ Route to services
└─ CI/CD: GitHub Actions
   ├─ Run tests
   ├─ Build images
   └─ Deploy to registry
```

## Performance Considerations

### Database Optimization
- Indexes on foreign keys and frequently queried columns
- Pagination for large result sets
- Connection pooling for efficiency

### API Optimization
- Minimal response payloads
- Efficient queries (avoid N+1)
- Caching ready (Future)
- Rate limiting ready (Future)

### Frontend Optimization
- Code splitting with Vite
- Lazy loading components
- Local state management
- Minimal re-renders

## Scalability Path

### Phase 1: Current
- Single Flask instance
- SQLite/Single MySQL
- Single frontend build
- GitHub Actions

### Phase 2: Growth
- Gunicorn with multiple workers
- MySQL with read replicas
- Redis caching
- CDN for static assets

### Phase 3: Enterprise
- Kubernetes orchestration
- Database sharding
- Microservices architecture
- GraphQL API
- WebSocket for real-time

---

This architecture provides a solid foundation for a production web application with room for growth and scaling.
