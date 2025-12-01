# Flask Task Management System - Professional Full-Stack Application

A comprehensive, production-ready task management system built with Flask (Python backend) and TypeScript (frontend). This project demonstrates professional software development practices including authentication, authorization, REST API design, database management, testing, and CI/CD.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Database Schema](#database-schema)
- [Security Considerations](#security-considerations)
- [Deployment](#deployment)

## Features

✅ **User Authentication & Authorization**
- JWT-based authentication with access and refresh tokens
- Secure password hashing with PBKDF2
- User registration and login endpoints
- Token refresh mechanism

✅ **RESTful API**
- Complete CRUD operations for Projects and Tasks
- Proper HTTP status codes and error handling
- Input validation with Marshmallow schemas
- Pagination support

✅ **Database Management**
- SQLAlchemy ORM with SQLAlchemy models
- Support for SQLite (development) and MySQL (production)
- Database migrations with Flask-Migrate
- Relational data integrity with foreign keys and cascades

✅ **Frontend**
- Modern TypeScript frontend with Vite
- Single-page application (SPA)
- Type-safe API client
- Responsive design with CSS

✅ **Testing**
- Unit and integration tests with pytest
- Test fixtures and database isolation
- Test coverage reporting

✅ **CI/CD Pipeline**
- GitHub Actions workflow
- Automated testing on push/PR
- Security scanning with Bandit
- Dependency checking with Safety

## Architecture

```
flask-web-app/
├── app/
│   ├── models/          # SQLAlchemy models (User, Project, Task)
│   ├── routes/          # API endpoints (auth, projects, tasks)
│   ├── schemas/         # Marshmallow validation schemas
│   ├── utils/           # Authentication, helpers
│   └── __init__.py      # Flask app factory
├── frontend/            # TypeScript/Vite frontend
│   ├── src/
│   │   ├── api.ts      # API client
│   │   ├── main.ts     # Application logic
│   │   └── styles.css  # Styling
│   └── public/         # Static assets
├── tests/              # Test suite
│   ├── conftest.py     # Pytest fixtures
│   ├── test_auth.py    # Authentication tests
│   ├── test_projects.py # Project tests
│   └── test_tasks.py   # Task tests
├── config/             # Configuration management
│   └── config.py       # Environment-specific configs
├── migrations/         # Alembic database migrations
├── .github/workflows/  # CI/CD pipelines
├── index.py           # Application entry point
├── requirements.txt   # Python dependencies
└── README.md          # This file
```

## Technology Stack

### Backend
- **Framework**: Flask 2.3.3
- **Database**: SQLAlchemy 2.0 (SQLite/MySQL)
- **Authentication**: PyJWT 2.8.0, Werkzeug
- **Validation**: Marshmallow 3.19.0
- **Testing**: Pytest 7.4.0
- **CORS**: Flask-CORS 4.0.0

### Frontend
- **Language**: TypeScript 5.1
- **Build Tool**: Vite 4.4.0
- **HTTP Client**: Axios 1.4.0
- **Styling**: CSS3 with CSS Variables

### DevOps
- **CI/CD**: GitHub Actions
- **Database Migrations**: Flask-Migrate/Alembic
- **Security Scanning**: Bandit, Safety

## Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- MySQL 8.0+ (optional, for production)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/flask-web-app.git
cd flask-web-app
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Configuration

### Environment Variables (.env)

```env
# Flask Configuration
FLASK_ENV=development
FLASK_APP=index.py

# Database
DATABASE_URL=sqlite:///app.db
# For MySQL: mysql+pymysql://user:password@localhost/database

# Security
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production

# Server
PORT=5001
HOST=0.0.0.0
DEBUG=True
```

### Configuration Classes

- **DevelopmentConfig**: SQLite, debug mode, detailed logging
- **TestingConfig**: In-memory database, testing mode
- **ProductionConfig**: MySQL, optimized settings, security hardening

## Running the Application

### Development Mode

**Backend:**
```bash
python index.py
# Server runs on http://localhost:5001
```

**Frontend** (in another terminal):
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Creates optimized build in frontend/dist/
```

**Backend:**
```bash
export FLASK_ENV=production
export DATABASE_URL=mysql+pymysql://user:password@host/db
python index.py
```

## API Documentation

### Health Check
```
GET /api/health
Response: { "status": "healthy", "message": "API is running" }
```

### Authentication Endpoints

**Register**
```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
Response: { "user": {...}, "tokens": {...} }
```

**Login**
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
Response: { "user": {...}, "tokens": {...} }
```

**Refresh Token**
```
POST /api/auth/refresh
Body: { "refresh_token": "..." }
Response: { "tokens": {...} }
```

### Projects Endpoints

**Get Projects** (paginated)
```
GET /api/projects?page=1&per_page=10
Headers: Authorization: Bearer <access_token>
Response: { "projects": [...], "total": 5, "pages": 1, "current_page": 1 }
```

**Get Project**
```
GET /api/projects/<id>
Headers: Authorization: Bearer <access_token>
Response: { "project": {...} }
```

**Create Project**
```
POST /api/projects
Headers: Authorization: Bearer <access_token>
Body: { "name": "Project Name", "description": "..." }
Response: { "project": {...} }
```

**Update Project**
```
PUT /api/projects/<id>
Headers: Authorization: Bearer <access_token>
Body: { "name": "...", "status": "active|completed|archived" }
Response: { "project": {...} }
```

**Delete Project**
```
DELETE /api/projects/<id>
Headers: Authorization: Bearer <access_token>
Response: { "message": "Project deleted successfully" }
```

### Tasks Endpoints

**Get Project Tasks** (with filtering)
```
GET /api/tasks/project/<project_id>?status=todo&priority=high
Headers: Authorization: Bearer <access_token>
Response: { "tasks": [...] }
```

**Get Task**
```
GET /api/tasks/<id>
Headers: Authorization: Bearer <access_token>
Response: { "task": {...} }
```

**Create Task**
```
POST /api/tasks/project/<project_id>
Headers: Authorization: Bearer <access_token>
Body: {
  "title": "Task Title",
  "description": "...",
  "priority": "low|medium|high",
  "assignee_id": 1
}
Response: { "task": {...} }
```

**Update Task**
```
PUT /api/tasks/<id>
Headers: Authorization: Bearer <access_token>
Body: {
  "title": "...",
  "status": "todo|in_progress|completed",
  "priority": "...",
  "assignee_id": "..."
}
Response: { "task": {...} }
```

**Delete Task**
```
DELETE /api/tasks/<id>
Headers: Authorization: Bearer <access_token>
Response: { "message": "Task deleted successfully" }
```

## Testing

### Run All Tests
```bash
pytest tests/ -v
```

### Run with Coverage
```bash
pytest tests/ --cov=app --cov-report=html
# Open htmlcov/index.html for detailed report
```

### Run Specific Test File
```bash
pytest tests/test_auth.py -v
pytest tests/test_projects.py -v
pytest tests/test_tasks.py -v
```

### Test Structure
- `conftest.py`: Shared fixtures (app, client, test users, projects)
- `test_auth.py`: Authentication endpoint tests
- `test_projects.py`: Project CRUD tests
- `test_tasks.py`: Task CRUD tests

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(120) UNIQUE NOT NULL,
  username VARCHAR(80) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(80),
  last_name VARCHAR(80),
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  owner_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  project_id INT NOT NULL,
  assignee_id INT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## Security Considerations

### Implemented Security Measures

1. **Password Security**
   - PBKDF2 hashing with 12 rounds
   - Minimum 8 character requirement
   - Never stored in plain text

2. **Authentication**
   - JWT tokens with expiration (24 hours for access, 30 days for refresh)
   - Refresh token rotation strategy
   - Bearer token validation on protected routes

3. **Authorization**
   - Users can only access their own projects and tasks
   - Resource ownership verification on all CRUD operations
   - Role-based access control ready (future enhancement)

4. **Input Validation**
   - Marshmallow schema validation on all endpoints
   - Email format validation
   - Length constraints on fields
   - SQL injection prevention through ORM

5. **API Security**
   - CORS headers properly configured
   - HTTP status codes follow standards
   - No sensitive data in error messages
   - Request rate limiting ready (future enhancement)

6. **Database Security**
   - Foreign key constraints
   - Data integrity with cascading deletes
   - Connection pooling for efficiency

### Production Hardening Checklist

- [ ] Set strong `SECRET_KEY` and `JWT_SECRET_KEY` in production
- [ ] Enable HTTPS/TLS for all communications
- [ ] Configure CORS for specific domains only
- [ ] Use environment-specific database URLs
- [ ] Implement rate limiting and request throttling
- [ ] Set up logging and monitoring
- [ ] Regular security audits and dependency updates
- [ ] Implement request signing for API security
- [ ] Add API versioning for backward compatibility
- [ ] Use secrets manager for credentials

## Deployment

### Docker Deployment (Optional)

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "index.py"]
```

Build and run:
```bash
docker build -t flask-task-app .
docker run -p 5001:5001 --env-file .env flask-task-app
```

### MySQL Connection String

For production with MySQL:
```
DATABASE_URL=mysql+pymysql://username:password@hostname:3306/database_name
```

### GitHub Actions CI/CD

The project includes automated:
- Unit and integration testing
- Code linting (flake8)
- Security scanning (Bandit, Safety)
- Test coverage reporting
- Build artifact creation

## Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am "Add feature"`
3. Push to remote: `git push origin feature/your-feature`
4. Create pull request on GitHub
5. CI/CD pipeline runs automatically
6. After approval, merge to main branch

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] File attachments for tasks
- [ ] Team collaboration features
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Task templates and automation
- [ ] Analytics and reporting
- [ ] Mobile app with React Native
- [ ] GraphQL API option
- [ ] Docker and Kubernetes deployment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, questions, or suggestions, please create an GitHub issue or contact the development team.

---

**Built with professional software development practices in mind** ✨
