# TaskFlow Milestone - Full-Stack Integration (Session 8)

## About This Session

The lab code for Session 8 **IS** the TaskFlow milestone for this session. The full-stack integration lab builds the complete TaskFlow application with both frontend and backend working together.

## Where to Find the Code

All TaskFlow code for this session is located in:

```
week-3/session-8-fullstack-integration/lab/
  backend/    - Express API with Prisma, auth, and task CRUD
  frontend/   - React app with auth context, task management UI
```

## What's Included

### Backend (Express + Prisma)
- User authentication (register/login with JWT)
- Task CRUD operations scoped to authenticated users
- Input validation and error handling
- Request logging middleware

### Frontend (React + Vite)
- Auth context with login/register/logout
- Protected routes with PrivateRoute guard
- Task management page with full CRUD
- Filter tasks by status
- Create and edit task forms
- Responsive design

## Getting Started

### 1. Start the Backend

```bash
cd lab/backend
cp .env.example .env        # Create environment file
npm install                  # Install dependencies
npx prisma migrate dev       # Create database and tables
npm run dev                  # Start on port 3001
```

### 2. Start the Frontend

```bash
cd lab/frontend
npm install                  # Install dependencies
npm run dev                  # Start on port 5173
```

### 3. Use the App

1. Open http://localhost:5173
2. Register a new account
3. Start creating and managing tasks

## Architecture

```
Browser (React on :5173)
   |
   | HTTP requests to /api/*
   | (proxied by Vite dev server)
   |
   v
Express Server (:3001)
   |
   | Prisma ORM queries
   |
   v
SQLite Database (dev.db)
```
