# TaskFlow - Full-Stack Task Management Application

A full-stack task management application built with React, Express, Prisma, and PostgreSQL. This project was developed as part of a fullstack web development course.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running Tests](#running-tests)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)

---

## Prerequisites

Before getting started, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Docker** and **Docker Compose** (for containerized deployment) - [Download](https://www.docker.com/get-started/)
- **Git** - [Download](https://git-scm.com/)

## Project Structure

```
taskflow/
  backend/                  # Express API server
    prisma/
      schema.prisma         # Database schema definition
    src/
      app.js                # Express application + routes
      __tests__/            # Test files
        setup.js            # Test database utilities
        validators.test.js  # Unit tests
        auth.test.js        # Auth integration tests
        tasks.test.js       # Task CRUD integration tests
      utils/
        validators.js       # Validation utility functions
    package.json
    Dockerfile
    .dockerignore
    railway.toml            # Railway deployment config
  frontend/                 # React + Vite application
    src/
      components/           # React components
      pages/                # Page components
      context/              # React Context providers
      App.jsx               # Root component with routing
      main.jsx              # Application entry point
    package.json
    vite.config.js
    Dockerfile
    nginx.conf              # SPA routing configuration
  docker-compose.yml        # Multi-container orchestration
  README.md                 # This file
```

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Edit .env with your database credentials (see Environment Variables below)

# Generate the Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database with sample data
npx prisma db seed

# Start the development server
npm run dev
```

The backend will be running at **http://localhost:3001**.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create your environment file (if needed)
# The frontend needs to know the API URL
echo "VITE_API_URL=http://localhost:3001" > .env

# Start the development server
npm run dev
```

The frontend will be running at **http://localhost:5173**.

---

## Environment Variables

### Backend (.env)

| Variable       | Description                        | Example                                                        |
|----------------|------------------------------------|----------------------------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string       | `postgresql://postgres:postgres@localhost:5432/taskflow`        |
| `JWT_SECRET`   | Secret key for signing JWT tokens  | `your-super-secret-key-at-least-32-chars` |
| `PORT`         | Server port                        | `3001`                                                         |
| `NODE_ENV`     | Environment mode                   | `development` or `production`                                  |

### Frontend (.env)

| Variable       | Description          | Example                    |
|----------------|----------------------|----------------------------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001`    |

**Important:** Never commit `.env` files to Git! They contain secrets.

---

## Database Setup

### Create the Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE taskflow;

# Exit psql
\q
```

### Run Migrations

```bash
cd backend

# Run all pending migrations
npx prisma migrate dev

# (Optional) View your database in Prisma Studio
npx prisma studio
```

### Create a Test Database

```bash
psql -U postgres -c "CREATE DATABASE taskflow_test;"

# Run migrations on the test database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow_test" npx prisma migrate dev
```

---

## Running Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode (re-runs on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run a specific test file
npx jest src/__tests__/validators.test.js --runInBand --forceExit
```

### Test Structure

| File                  | Type        | What it Tests                  |
|-----------------------|-------------|--------------------------------|
| `validators.test.js`  | Unit        | Email, password, sanitize, status validation |
| `auth.test.js`        | Integration | Register, login endpoints      |
| `tasks.test.js`       | Integration | Full CRUD + ownership security |

---

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and start all services (database, backend, frontend)
docker compose up --build

# Run in detached mode (background)
docker compose up --build -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove all data (including database)
docker compose down -v
```

### Access the Application

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:8080         |
| Backend  | http://localhost:3001         |
| Database | localhost:5432               |

### Run Database Migrations in Docker

After the first `docker compose up`, you need to run migrations:

```bash
# Run migrations inside the backend container
docker compose exec backend npx prisma migrate deploy
```

### Deploy to Railway

1. Push your code to a GitHub repository
2. Create an account at [railway.com](https://railway.com)
3. Create a new project and connect your GitHub repo
4. Add a PostgreSQL database service
5. Set environment variables (DATABASE_URL is auto-configured by Railway)
6. Deploy!

The `railway.toml` file in the backend directory configures the build and deploy settings.

---

## API Documentation

All API endpoints are prefixed with `/api`.

### Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-17T12:00:00.000Z"
}
```

---

### Authentication

#### Register

```
POST /api/auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "securepass1",
  "username": "johndoe"
}
```

Response (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Error responses:
- `400` - Missing email or password
- `409` - Email already registered

#### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "securepass1"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Error responses:
- `400` - Missing email or password
- `401` - Invalid email or password

---

### Tasks (Requires Authentication)

All task endpoints require the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

#### List Tasks

```
GET /api/tasks
```

Query parameters (optional):
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)

Response (200):
```json
[
  {
    "id": 1,
    "title": "Build login page",
    "description": "Create a React login form",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-03-01T00:00:00.000Z",
    "userId": 1,
    "createdAt": "2026-02-17T12:00:00.000Z",
    "updatedAt": "2026-02-17T14:30:00.000Z"
  }
]
```

#### Create Task

```
POST /api/tasks
```

Request body:
```json
{
  "title": "Build login page",
  "description": "Create a React login form with email and password",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-03-01T00:00:00.000Z"
}
```

Only `title` is required. Defaults: `status="pending"`, `priority="medium"`.

Response (201):
```json
{
  "id": 1,
  "title": "Build login page",
  "description": "Create a React login form with email and password",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-03-01T00:00:00.000Z",
  "userId": 1,
  "createdAt": "2026-02-17T12:00:00.000Z",
  "updatedAt": "2026-02-17T12:00:00.000Z"
}
```

Error responses:
- `400` - Missing title or invalid priority
- `401` - Not authenticated

#### Get Task

```
GET /api/tasks/:id
```

Response (200):
```json
{
  "id": 1,
  "title": "Build login page",
  "description": "Create a React login form",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-03-01T00:00:00.000Z",
  "userId": 1,
  "createdAt": "2026-02-17T12:00:00.000Z",
  "updatedAt": "2026-02-17T12:00:00.000Z"
}
```

Error responses:
- `401` - Not authenticated
- `404` - Task not found (or belongs to another user)

#### Update Task

```
PUT /api/tasks/:id
```

Request body (all fields optional):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "dueDate": "2026-04-01T00:00:00.000Z"
}
```

Response (200): Updated task object (same shape as Get Task).

Error responses:
- `400` - Invalid priority
- `401` - Not authenticated
- `404` - Task not found

#### Delete Task

```
DELETE /api/tasks/:id
```

Response: `204 No Content` (empty body)

Error responses:
- `401` - Not authenticated
- `404` - Task not found

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED` on database | Make sure PostgreSQL is running |
| `P1001: Can't reach database server` | Check your DATABASE_URL in .env |
| Frontend shows blank page | Check browser console for errors; verify VITE_API_URL |
| CORS errors | Make sure backend has `cors()` middleware enabled |
| Docker build fails | Run `docker system prune` to free space, then retry |
| Prisma migrations fail | Delete `prisma/migrations` folder and run `npx prisma migrate dev` fresh |
| Tests timeout | Increase `testTimeout` in jest.config.js |

---

## License

MIT
