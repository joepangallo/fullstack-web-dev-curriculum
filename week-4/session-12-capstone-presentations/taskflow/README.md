# TaskFlow

> A full-stack task management application built with React, Express, Prisma, and PostgreSQL.

<!-- Replace this section with a screenshot of your app -->
<!-- ![TaskFlow Screenshot](./screenshot.png) -->

## About

TaskFlow is a task management application that allows users to create, organize, and track their tasks. Built as a capstone project for a fullstack web development course.

### Features

- User registration and authentication (JWT)
- Create, read, update, and delete tasks
- Task status tracking (pending, in-progress, completed)
- Task priority levels (low, medium, high)
- Optional due dates
- Responsive design
- Secure API with user-scoped data

### Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, Vite, React Router, Axios    |
| Backend   | Node.js, Express                    |
| Database  | PostgreSQL, Prisma ORM              |
| Auth      | JSON Web Tokens (JWT), bcryptjs     |
| Testing   | Jest, Supertest                     |
| Deploy    | Docker, Docker Compose              |

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- npm (included with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskflow"
JWT_SECRET="your-secret-key-change-this"
PORT=3001
NODE_ENV=development
```

Set up the database:

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE taskflow;"

# Run migrations
npx prisma migrate dev

# Generate the Prisma client
npx prisma generate

# Start the server
npm run dev
```

### 3. Set Up the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3001
```

```bash
npm run dev
```

### 4. Open the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## Running Tests

```bash
cd backend

# Create a test database
psql -U postgres -c "CREATE DATABASE taskflow_test;"

# Run migrations on the test database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskflow_test" npx prisma migrate dev

# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description      | Auth Required |
|--------|----------------------|------------------|---------------|
| POST   | `/api/auth/register` | Register user    | No            |
| POST   | `/api/auth/login`    | Login user       | No            |

### Tasks

| Method | Endpoint          | Description      | Auth Required |
|--------|-------------------|------------------|---------------|
| GET    | `/api/tasks`      | List all tasks   | Yes           |
| POST   | `/api/tasks`      | Create a task    | Yes           |
| GET    | `/api/tasks/:id`  | Get single task  | Yes           |
| PUT    | `/api/tasks/:id`  | Update a task    | Yes           |
| DELETE | `/api/tasks/:id`  | Delete a task    | Yes           |

---

## Project Structure

```
taskflow/
  backend/
    prisma/
      schema.prisma        # Database schema
    src/
      app.js               # Express app + routes
      utils/
        validators.js      # Input validation functions
      __tests__/
        setup.js           # Test database utilities
        validators.test.js # Unit tests
        auth.test.js       # Auth integration tests
        tasks.test.js      # Task CRUD integration tests
    .env                   # Environment variables (not committed)
    .env.test              # Test environment variables (not committed)
    package.json
  frontend/
    src/
      components/          # Reusable React components
      pages/               # Page-level components
      context/             # React Context providers
      services/            # API service functions
      App.jsx              # Root component with routing
      main.jsx             # Entry point
    .env                   # Frontend environment variables (not committed)
    package.json
    vite.config.js
```

---

## What I Learned

<!-- Replace this section with your own reflections -->

- Building a REST API with Express and Prisma
- Implementing JWT authentication from scratch
- Managing frontend state with React Context
- Writing unit and integration tests with Jest
- Containerizing applications with Docker
- The importance of error handling and security

---

## Future Improvements

<!-- List features you would add with more time -->

- [ ] Real-time updates with WebSockets
- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Drag-and-drop task reordering
- [ ] Team workspaces / shared tasks
- [ ] Task categories and tags
- [ ] Search and advanced filtering
- [ ] Dark mode toggle

---

## Author

**Your Name** - [GitHub](https://github.com/YOUR_USERNAME)

Built as part of the Fullstack Web Development Course, 2026.

---

## License

This project is licensed under the MIT License.
