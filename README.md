# Flask Task Management System

A **production-ready** full-stack web application demonstrating professional software development practices with Python, TypeScript, and modern web technologies.

## 🚀 Quick Links

- **[Full Documentation](docs/README.md)** - Complete setup and API reference
- **[Setup Guide](docs/SETUP.md)** - Get started in 5 minutes
- **[API Documentation](docs/README.md#api-documentation)** - All endpoints explained

## ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based with refresh tokens
- 💾 **Database Management** - SQLAlchemy ORM with SQLite/MySQL support
- 🌐 **REST API** - Full CRUD operations with validation
- 📱 **Modern Frontend** - TypeScript + Vite responsive web app
- ✅ **Comprehensive Testing** - Unit and integration tests with pytest
- 🔄 **CI/CD Pipeline** - GitHub Actions for automated testing and deployment
- 📚 **Professional Code** - Type-safe, well-documented, scalable architecture

## 🛠 Technology Stack

| Layer | Technologies |
|-------|---|
| **Backend** | Python 3.9+, Flask 2.3, SQLAlchemy 2.0, PyJWT |
| **Frontend** | TypeScript 5.1, Vite 4.4, Axios, CSS3 |
| **Database** | SQLite (dev), MySQL 8.0 (prod) |
| **Testing** | Pytest 7.4, pytest-cov |
| **DevOps** | GitHub Actions, Docker ready |

## 📋 Project Structure

```
flask-web-app/
├── app/                    # Flask application
│   ├── models/            # Database models (User, Project, Task)
│   ├── routes/            # API endpoints
│   ├── schemas/           # Request/response validation
│   └── utils/             # Authentication, helpers
├── frontend/              # TypeScript/Vite frontend
│   └── src/              # Application code & styles
├── tests/                 # Comprehensive test suite
├── config/                # Environment configuration
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD pipelines
├── index.py              # Application entry point
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites
- Python 3.9+ with pip
- Node.js 16+ with npm
- Git

### Installation (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/flask-web-app.git
cd flask-web-app

# 2. Setup backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Setup frontend
cd frontend
npm install
cd ..

# 4. Configure environment
cp .env.example .env

# 5. Start services (two terminals)
# Terminal 1:
python index.py
# Server: http://localhost:5001

# Terminal 2:
cd frontend && npm run dev
# App: http://localhost:3000
```

## 📚 API Examples

### Register a new user
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }'
```

### Create a project
```bash
curl -X POST http://localhost:5001/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

## ✅ Testing

```bash
# Run all tests with coverage
pytest tests/ --cov=app --cov-report=html

# Run specific test suite
pytest tests/test_auth.py -v

# View coverage report
open htmlcov/index.html
```

## 🔒 Security Features

- ✅ PBKDF2 password hashing
- ✅ JWT authentication with expiration
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ SQL injection prevention (ORM)
- ✅ Authorization checks on all endpoints
- ✅ Secure token refresh mechanism

## 📦 Database Schema

Three core entities with relationships:

- **Users** - User accounts with authentication
- **Projects** - User-owned projects
- **Tasks** - Project-specific tasks

See [full schema documentation](docs/README.md#database-schema)

## 🔄 CI/CD Pipeline

Automated GitHub Actions workflow includes:
- Python linting (flake8)
- Unit & integration tests
- Security scanning (Bandit, Safety)
- Code coverage reporting
- Build artifacts creation

See [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml)

## 🌐 Deployment

### Docker
```bash
docker build -t flask-task-app .
docker run -p 5001:5001 --env-file .env flask-task-app
```

### Production Setup
See [Deployment section](docs/README.md#deployment) for:
- MySQL configuration
- Environment variables
- Security hardening checklist
- Scaling considerations

## 📖 Documentation

- **[Full README](docs/README.md)** - Architecture, API docs, database schema
- **[Setup Guide](docs/SETUP.md)** - Quick start & troubleshooting
- **Code comments** - Inline documentation throughout

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes with tests
3. Push and create Pull Request
4. CI/CD pipeline validates automatically

## 📋 Project Features

### Authentication System
- User registration with validation
- Login with password verification
- JWT access & refresh tokens
- Secure token storage

### REST API
- Full CRUD for projects and tasks
- Proper HTTP status codes
- Input/output validation
- Error handling
- Pagination support

### Frontend Application
- Single-page application (SPA)
- Project management interface
- Task creation and editing
- User-friendly UI with responsive design
- Type-safe API integration

### Testing & Quality
- 50+ test cases
- Unit and integration tests
- Test fixtures and mocking
- Code coverage reporting

### DevOps & Deployment
- GitHub Actions CI/CD
- Automated testing on push
- Security scanning
- Docker containerization ready

## 🎯 Real-World Best Practices

This project demonstrates:

✅ **Backend**
- Layered architecture (models → routes → services)
- Database ORM patterns
- JWT authentication flow
- Input validation with schemas
- Comprehensive error handling
- Proper HTTP semantics

✅ **Frontend**
- TypeScript for type safety
- API client abstraction
- State management
- Responsive design
- User feedback & error handling

✅ **DevOps**
- Environment-specific configs
- Database migrations
- Automated testing
- CI/CD pipeline
- Container readiness

## 🔗 Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [REST API Design](https://restfulapi.net/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License - see LICENSE file for details

## 💡 Support

For issues or questions:
1. Check [SETUP.md](docs/SETUP.md) troubleshooting section
2. Review [Full Documentation](docs/README.md)
3. Create GitHub issue with details

---

**Built with professional software engineering practices** 🏗️

**Ready for production deployment** 🚀

**Type-safe and fully tested** ✨