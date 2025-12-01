# Flask Task Management System - Setup Guide

## Quick Start

This guide will get you up and running in 5 minutes.

### 1. Install Dependencies

**Backend:**
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
```

The `.env` file contains all configuration. Default values work for local development.

### 3. Start Services

Open two terminals:

**Terminal 1 - Backend:**
```bash
source venv/bin/activate
python index.py
```
Server runs on: http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on: http://localhost:3000

### 4. Use the Application

1. Open http://localhost:3000 in your browser
2. Click "Register" and create a new account
3. Create a project
4. Add tasks to your project
5. Manage your tasks!

## API Testing with curl

### Register a user
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a project (use token from login)
```bash
curl -X POST http://localhost:5001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

## Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v
```

## Troubleshooting

### Port already in use
- Backend: Change `PORT` in `.env`
- Frontend: `npm run dev -- --port 3001`

### Database error
- Delete `app.db` file
- Restart backend (recreates database)

### CORS error
- Ensure backend is running on port 5001
- Check frontend proxy in `vite.config.ts`

### Dependency issues
```bash
# Backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend
rm -rf node_modules package-lock.json
npm install
```

## Project Structure at a Glance

```
backend/           - Flask REST API
├── app/
│   ├── models/   - Database models
│   ├── routes/   - API endpoints
│   └── utils/    - Authentication helpers
├── tests/        - Test suite
└── index.py      - Entry point

frontend/         - TypeScript/Vite app
├── src/
│   ├── api.ts    - API client
│   ├── main.ts   - UI logic
│   └── styles.css - Styling
└── package.json  - Dependencies
```

## What's Next?

1. **Explore the code** - Check `app/routes/` for API implementation
2. **Run tests** - `pytest tests/ -v` to see test patterns
3. **Customize** - Modify models, routes, and frontend as needed
4. **Deploy** - Follow deployment section in README.md

## Need Help?

Check the documentation:
- `docs/README.md` - Full documentation
- API endpoints in `app/routes/`
- Database models in `app/models/__init__.py`
- Frontend client in `frontend/src/api.ts`

Happy coding! 🚀
