# Common Commands Reference

## 🚀 Quick Start Commands

### Initial Setup
```bash
# Clone repository
git clone https://github.com/yourusername/flask-web-app.git
cd flask-web-app

# Setup virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Setup frontend
cd frontend
npm install
cd ..

# Configure environment
cp .env.example .env
```

### Running the Application

**Terminal 1 - Backend:**
```bash
source venv/bin/activate
python index.py
# Server runs on http://localhost:5001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## 🧪 Testing Commands

### Run All Tests
```bash
# Basic test run
pytest tests/

# Verbose output
pytest tests/ -v

# With coverage report
pytest tests/ --cov=app --cov-report=html

# Open HTML coverage report
open htmlcov/index.html  # macOS
start htmlcov/index.html  # Windows
```

### Run Specific Test Suite
```bash
# Authentication tests
pytest tests/test_auth.py -v

# Project tests
pytest tests/test_projects.py -v

# Task tests
pytest tests/test_tasks.py -v

# Single test
pytest tests/test_auth.py::TestAuthEndpoints::test_register_success -v
```

### Test with Debug Output
```bash
# Show print statements
pytest tests/ -s

# Drop to debugger on failure
pytest tests/ --pdb

# Show local variables on failure
pytest tests/ -l
```

## 📝 API Testing with curl

### Health Check
```bash
curl http://localhost:5001/api/health
```

### Authentication

**Register**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Refresh Token**
```bash
curl -X POST http://localhost:5001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'
```

### Projects (with authentication)

**Get All Projects**
```bash
curl http://localhost:5001/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Get Single Project**
```bash
curl http://localhost:5001/api/projects/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Create Project**
```bash
curl -X POST http://localhost:5001/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

**Update Project**
```bash
curl -X PUT http://localhost:5001/api/projects/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "status": "completed"
  }'
```

**Delete Project**
```bash
curl -X DELETE http://localhost:5001/api/projects/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Tasks

**Get Project Tasks**
```bash
curl http://localhost:5001/api/tasks/project/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# With filters
curl "http://localhost:5001/api/tasks/project/1?status=todo&priority=high" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Get Single Task**
```bash
curl http://localhost:5001/api/tasks/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Create Task**
```bash
curl -X POST http://localhost:5001/api/tasks/project/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task Title",
    "description": "Task description",
    "priority": "high",
    "assignee_id": 1
  }'
```

**Update Task**
```bash
curl -X PUT http://localhost:5001/api/tasks/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "status": "in_progress",
    "priority": "medium"
  }'
```

**Delete Task**
```bash
curl -X DELETE http://localhost:5001/api/tasks/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔧 Development Commands

### Backend

**Install New Package**
```bash
pip install package-name
pip freeze > requirements.txt
```

**Database Migration**
```bash
# Create migration
flask db migrate -m "Description"

# Apply migration
flask db upgrade

# Downgrade
flask db downgrade
```

**Run Flask Shell**
```bash
flask shell
# Then in shell:
from app.models import db, User, Project, Task
from app import create_app

app = create_app()
with app.app_context():
    users = User.query.all()
```

**Reset Database**
```bash
# Remove SQLite database
rm app.db

# Restart app to recreate
python index.py
```

### Frontend

**Build for Production**
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

**Type Check**
```bash
cd frontend
npm run type-check
```

**Linting**
```bash
cd frontend
npm run lint
```

## 📦 Dependency Management

### Update Dependencies

**Python**
```bash
# Check outdated packages
pip list --outdated

# Update all packages
pip install --upgrade -r requirements.txt

# Update specific package
pip install --upgrade flask
```

**Frontend**
```bash
# Check outdated packages
cd frontend
npm outdated

# Update packages
npm update

# Install latest version of package
npm install package-name@latest
```

## 🐳 Docker Commands

### Build Image
```bash
docker build -t flask-task-app .
```

### Run Container
```bash
docker run -p 5001:5001 \
  --env-file .env \
  -e FLASK_ENV=development \
  flask-task-app
```

### Run with Volume
```bash
docker run -p 5001:5001 \
  --env-file .env \
  -v $(pwd):/app \
  flask-task-app
```

## 🔍 Debugging

### Enable Debug Logging

**Backend:**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.debug("Debug message")
```

**Frontend:**
```typescript
console.log("Debug:", variable);
console.table(data);
console.error("Error:", error);
```

### Check Active Routes
```bash
# In Flask shell
from app import create_app
app = create_app()
for rule in app.url_map.iter_rules():
    print(f"{rule.endpoint}: {rule.rule}")
```

## 📊 Code Quality

### Linting
```bash
# Python linting
pip install flake8
flake8 app/ tests/ index.py

# Fix style issues
pip install autopep8
autopep8 --in-place -r app/
```

### Type Checking

**Python:**
```bash
pip install mypy
mypy app/
```

**TypeScript:**
```bash
cd frontend
npx tsc --noEmit
```

### Security Scanning

**Python Dependencies:**
```bash
pip install safety bandit
safety check
bandit -r app/
```

## 🚀 Deployment

### Production Setup

**Environment Variables:**
```bash
export FLASK_ENV=production
export DATABASE_URL="mysql+pymysql://user:pass@host/db"
export SECRET_KEY="strong-secret-key"
export JWT_SECRET_KEY="jwt-secret-key"
```

**Start with Gunicorn:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 index:app
```

### GitHub Workflow Check

```bash
# View workflow status
git push origin feature-branch
# Check: https://github.com/yourusername/flask-web-app/actions
```

## 🔗 Git Commands

### Common Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, then:
git add .
git commit -m "Add feature description"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
# Wait for CI/CD to pass
# Merge to main
```

### View Commit History
```bash
git log --oneline
git log --graph --all --decorate
```

### Undo Changes
```bash
# Discard changes in working directory
git checkout -- filename

# Reset to last commit
git reset --hard HEAD

# Revert a commit
git revert <commit-hash>
```

## 📚 Documentation

### Generate API Documentation
```
GET http://localhost:5001/api/docs
```

### Generate Code Coverage Report
```bash
pytest tests/ --cov=app --cov-report=html
open htmlcov/index.html
```

### View Test Coverage Details
```bash
pytest tests/ --cov=app --cov-report=term-missing
```

---

## 📋 Troubleshooting Commands

### Port Already in Use

**Find process using port:**
```bash
# Port 5001
lsof -i :5001
kill -9 <PID>

# Port 3000
lsof -i :3000
kill -9 <PID>
```

### Database Issues

```bash
# Reset SQLite database
rm app.db

# Check database connection
python -c "from app.models import db; print('DB OK')"
```

### Dependency Conflicts

```bash
# Clean reinstall
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Clear Cache

```bash
# Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Node cache
cd frontend && npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🎓 Useful Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [REST API Best Practices](https://restfulapi.net/)
- [JWT Tutorial](https://jwt.io/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Pytest Documentation](https://docs.pytest.org/)

---

**Quick Reference saved for daily development!** 📌
