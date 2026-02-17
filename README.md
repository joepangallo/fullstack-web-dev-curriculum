# Full-Stack Web Development Curriculum

**Course Title:** Full-Stack Web Application Development
**Duration:** 15 Weeks (1 semester)
**Stack:** React 18+, Node.js, Express.js, PostgreSQL
**Capstone Project:** TaskFlow — A Project Management Application

*Developed with contributions from Claude (Anthropic), Gemini 2.5 Pro, and Gemini 2.5 Flash*

---

## Prerequisites

Students must have a solid foundation in:

- **HTML5 & CSS3:** Semantic HTML, Flexbox, Grid, responsive design
- **JavaScript (ES6+):** Variables, data types, functions, objects, arrays, promises, async/await, DOM manipulation
- **Git & GitHub:** clone, add, commit, push, pull, branching basics
- **Command Line:** Navigating directories, running commands in a terminal

---

## Grading Breakdown

| Component | Weight | Details |
|-----------|--------|---------|
| Weekly Labs | 20% | In-class exercises (best 12 of 13) |
| Weekly Homework | 30% | Incremental TaskFlow capstone milestones |
| Midterm Exam | 15% | Practical exam covering Weeks 1-7 |
| Final Exam | 15% | Comprehensive practical exam |
| Capstone Project | 20% | Final TaskFlow application (code + presentation) |

---

## Course Objectives

1. Build interactive and dynamic user interfaces utilizing a front-end framework
2. Implement robust server-side logic with a JavaScript runtime for back-end web development
3. Design and implement route processing for efficient handling of HTTP request/response objects
4. Develop and/or apply middleware functions to separate and streamline server-side logic
5. Build and consume RESTful APIs that adhere to industry standards
6. Apply authentication and authorization mechanisms to secure a web application
7. Utilize various state and persistence mechanisms such as cookies, file systems, and databases to ensure data consistency and integrity

---

## Capstone Project: TaskFlow

TaskFlow is a project management application built incrementally throughout the semester. Final features include:

- User registration and login (JWT authentication)
- Project creation and management
- Task CRUD with status tracking (pending, in-progress, completed)
- User profile with avatar upload
- Role-based access (owner vs. collaborator)
- Responsive React frontend consuming a RESTful API

---

## Weekly Breakdown

---

### Week 1: Dev Environment + React Fundamentals

**Objectives Covered:** 1

**Lecture Topics:**
- Course overview and full-stack landscape
- Setting up Node.js, npm, and Vite
- What is React? Virtual DOM, component-based architecture
- JSX syntax and functional components
- Props for data flow between components
- `useState` hook for managing component state

**Lab Exercise (60-90 min):**
- **Objective:** Set up a React project and create an interactive counter component using JSX, props, and `useState`.
- **Steps:**
  1. Initialize a new React project: `npm create vite@latest my-app -- --template react`
  2. Navigate into the project and clean up boilerplate files
  3. Create `src/components/CounterDisplay.jsx` — a component that accepts a `startValue` prop
  4. Use `useState` to manage the counter internally
  5. Add Increment and Decrement buttons with `onClick` handlers
  6. Render `CounterDisplay` in `App.jsx` with `startValue={0}`
  7. Run `npm run dev` and verify functionality
  8. Add a second counter with `startValue={10}` to demonstrate component reusability
- **Expected Output:** A page with two independent counters, each with working increment/decrement buttons
- **Common Pitfall:** Directly mutating state instead of using the setter function (e.g., `count++` instead of `setCount(count + 1)`)

**Homework (100 points):**
- React project setup and folder structure: 20 pts
- Correct use of JSX and functional components: 20 pts
- Component reusability and modularity (2+ custom components): 20 pts
- Effective use of props for parent-child data flow: 20 pts
- Proper `useState` implementation for interactive elements: 20 pts

**TaskFlow Milestone:** Set up the TaskFlow React project with Vite. Create `Header` (app name + nav placeholder), `Footer` (copyright), and a static `TaskCard` component that displays a task title and status via props.

---

### Week 2: Advanced React — State Management & Forms

**Objectives Covered:** 1

**Lecture Topics:**
- Handling user events (onClick, onChange, onSubmit)
- Controlled form components
- `useEffect` hook — side effects, dependency arrays, cleanup
- Conditional rendering patterns
- Lists and keys
- Introduction to Context API for global state

**Lab Exercise (60-90 min):**
- **Objective:** Build a todo list with data fetching simulation, form input, and conditional rendering.
- **Steps:**
  1. Create `src/components/TodoList.jsx` with `useState` for the todo array
  2. Use `useEffect` with `setTimeout` to simulate async data fetching (1-second delay)
  3. Add conditional rendering: "Loading..." while fetching, "No todos yet" if empty
  4. Map over todos and render each in a `<li>` element with a unique `key`
  5. Create `src/components/AddTodoForm.jsx` with a controlled text input
  6. Implement `onSubmit` handler — prevent default, validate non-empty, call parent callback
  7. In `App.jsx`, wire the form callback to add new items to the todo state
  8. Add a "Mark Complete" toggle button per todo with strikethrough styling
- **Expected Output:** Page shows "Loading...", then mock todos appear. Form adds new todos to the list. Clicking "Mark Complete" toggles strikethrough.
- **Common Pitfall:** Infinite loops from missing or incorrect `useEffect` dependency arrays. Forgetting `e.preventDefault()` in form submission causing page reload.

**Homework (100 points):**
- `useEffect` for data fetching with proper dependency array: 25 pts
- Controlled form with event handlers: 25 pts
- Conditional rendering (loading, empty, data states): 20 pts
- State management and parent-child data flow: 20 pts
- Code quality, readability, and modularity: 10 pts

**TaskFlow Milestone:** Create `TaskInput` (form for adding tasks) and `TaskList` (displays task cards) components. Use `useState` to manage a local task array. Implement add/display/toggle-complete functionality with mock data. Use `useEffect` to simulate loading state.

---

### Week 3: Node.js Fundamentals + Express.js + Routing

**Objectives Covered:** 2, 3

**Lecture Topics:**
- Node.js event-driven architecture and non-blocking I/O
- npm project initialization and dependency management
- Introduction to Express.js — why use a framework?
- Creating an HTTP server with Express
- Route definitions: GET, POST, PUT, DELETE
- Request parameters: `req.params`, `req.query`, `req.body`
- HTTP status codes and JSON responses

**Lab Exercise (60-90 min):**
- **Objective:** Set up an Express server with multiple routes and parameter handling.
- **Steps:**
  1. Create a `backend/` directory and run `npm init -y`
  2. Install Express: `npm install express`
  3. Create `src/app.js` with Express server listening on port 3000
  4. Define `GET /` — responds with "Hello, Express Server!"
  5. Define `GET /api/data` — responds with `{ message: "Data from API" }`
  6. Define `GET /api/users/:id` — extracts `id` from `req.params`, returns `{ userId: "..." }`
  7. Define `GET /api/search?q=term` — extracts `q` from `req.query`
  8. Add `"start": "node src/app.js"` to `package.json`
  9. Test all routes with browser/curl/Postman
- **Expected Output:** Each route returns the correct JSON response with appropriate status codes
- **Common Pitfall:** Forgetting `app.listen()` or not installing Express before importing it

**Homework (100 points):**
- Node.js project setup and dependency management: 20 pts
- Express server initialization and listening: 20 pts
- Correct route definitions (3+ routes with different methods): 30 pts
- Proper JSON responses with status codes: 20 pts
- Server starts and runs without errors: 10 pts

**TaskFlow Milestone:** Create the TaskFlow backend project. Set up an Express server with `GET /api/tasks` returning a hardcoded array of task objects. Add `GET /api/tasks/:id` for single task retrieval.

---

### Week 4: Middleware Deep Dive

**Objectives Covered:** 4

**Lecture Topics:**
- The Express request-response cycle
- What is middleware? `(req, res, next)` pattern
- Built-in middleware: `express.json()`, `express.static()`
- Third-party middleware: `cors`, `morgan`
- Writing custom middleware (logging, validation, auth stubs)
- Error-handling middleware `(err, req, res, next)`
- Middleware execution order matters

**Lab Exercise (60-90 min):**
- **Objective:** Integrate multiple middleware layers into an Express app.
- **Steps:**
  1. Continue from Week 3 project
  2. Install `cors`: `npm install cors`
  3. Add `app.use(cors())` and `app.use(express.json())`
  4. Create custom logging middleware that logs `[TIMESTAMP] METHOD /path`
  5. Create a validation middleware for POST routes that checks for required fields
  6. Add a `POST /api/items` route that uses `req.body`
  7. Add 404 handler middleware (after all routes)
  8. Add global error handler `(err, req, res, next)` as the last middleware
  9. Test with Postman — valid POST, invalid POST (missing fields), non-existent route
- **Expected Output:** Console logs every request. POST with valid body returns 201. POST without required fields returns 400. Unknown routes return 404 JSON error. Thrown errors return 500.
- **Common Pitfall:** Placing error-handling middleware before routes (it won't catch anything). Forgetting to call `next()` in custom middleware, causing requests to hang.

**Homework (100 points):**
- `cors` and `express.json()` configuration: 20 pts
- Custom logging middleware implementation: 20 pts
- Validation middleware for POST requests: 20 pts
- 404 and global error handling middleware: 20 pts
- Correct middleware ordering demonstrated: 10 pts
- Code organization: 10 pts

**TaskFlow Milestone:** Add `cors`, `express.json()`, and custom logging middleware to the TaskFlow backend. Create `POST /api/tasks` that accepts a task object from the request body and adds it to the in-memory array. Add input validation middleware (title required, max 255 chars). Implement 404 and error handlers.

---

### Week 5: RESTful API Design + CRUD

**Objectives Covered:** 5

**Lecture Topics:**
- REST principles: resources, URIs, HTTP methods, statelessness
- Proper status codes: 200, 201, 204, 400, 404, 500
- Request/response body conventions
- API versioning basics
- Designing resource endpoints
- Testing with Postman collections
- API documentation basics

**Lab Exercise (60-90 min):**
- **Objective:** Implement a complete RESTful CRUD API with proper status codes and test it thoroughly.
- **Steps:**
  1. Define an in-memory `items` array with sample data
  2. `GET /api/items` — return all items (200)
  3. `GET /api/items/:id` — return one item or 404
  4. `POST /api/items` — create item, assign ID with `Date.now()`, return 201
  5. `PUT /api/items/:id` — update existing item or 404
  6. `DELETE /api/items/:id` — remove item, return 204
  7. Create a Postman collection testing all 5 endpoints
  8. Test edge cases: non-existent IDs, missing required fields
- **Expected Output:** Full CRUD operations working with correct HTTP methods and status codes. Postman collection with all tests passing.
- **Common Pitfall:** Using GET for creation or POST for deletion. Returning 200 instead of 201 for creation or 204 for deletion.

**Homework (100 points):**
- RESTful design adherence (correct methods + URIs): 25 pts
- GET routes (all + by ID) implementation: 20 pts
- POST route with validation: 20 pts
- PUT route with validation: 20 pts
- DELETE route implementation: 10 pts
- Postman collection provided: 5 pts

**TaskFlow Milestone:** Implement full CRUD for tasks: `GET /api/tasks`, `GET /api/tasks/:id`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`. All using in-memory storage with proper status codes and error responses. Create a Postman collection.

---

### Week 6: PostgreSQL + Schema Design

**Objectives Covered:** 7

**Lecture Topics:**
- Introduction to relational databases
- PostgreSQL installation and setup
- SQL fundamentals: CREATE TABLE, INSERT, SELECT, UPDATE, DELETE
- Data types: SERIAL, VARCHAR, TEXT, INTEGER, BOOLEAN, TIMESTAMP
- Primary keys, foreign keys, constraints (NOT NULL, UNIQUE, DEFAULT)
- Table relationships (one-to-many)
- Using `psql` CLI and/or pgAdmin/DBeaver

**Lab Exercise (60-90 min):**
- **Objective:** Set up PostgreSQL, create tables with relationships, and run SQL queries.
- **Steps:**
  1. Install PostgreSQL and verify with `psql --version`
  2. Create database: `createdb webdev_db`
  3. Connect: `psql webdev_db`
  4. Create `users` table with id (SERIAL PRIMARY KEY), username, email, password_hash, created_at
  5. Create `tasks` table with foreign key to `users`
  6. Insert 3 sample users and 5 sample tasks
  7. Run queries: `SELECT *`, `WHERE`, `JOIN`, `ORDER BY`
  8. Write a JOIN query: tasks with associated usernames
- **Expected Output:** Populated tables with working queries returning correct results
- **Common Pitfall:** Forgetting `SERIAL PRIMARY KEY` for auto-incrementing IDs. Foreign key referencing a non-existent column or table.

**Homework (100 points):**
- PostgreSQL setup proof (screenshot or query output): 20 pts
- Schema design (correct types, keys, relationships): 30 pts
- INSERT statements with meaningful sample data: 20 pts
- SELECT queries with WHERE, JOIN, ORDER BY: 20 pts
- SQL script readability and conventions: 10 pts

**TaskFlow Milestone:** Design and create the TaskFlow database schema. Create `users` and `tasks` tables with proper relationships. Provide `.sql` script files with `CREATE TABLE` and `INSERT` statements. The `tasks` table must reference `users` via foreign key.

---

### Week 7: Database Integration with Node.js

**Objectives Covered:** 2, 7

**Lecture Topics:**
- Connecting Node.js to PostgreSQL with the `pg` library
- Connection pools vs. single connections
- Parameterized queries to prevent SQL injection
- Refactoring from in-memory to database-backed CRUD
- Environment variables with `dotenv` for credentials
- Database error handling patterns
- Introduction to migrations

**Lab Exercise (60-90 min):**
- **Objective:** Connect Express to PostgreSQL and refactor CRUD operations to use the database.
- **Steps:**
  1. Install: `npm install pg dotenv`
  2. Create `.env` with `DATABASE_URL=postgresql://user:pass@localhost:5432/webdev_db`
  3. Create `src/db.js` — configure a `Pool` from `pg`, export `query` function
  4. Refactor `GET /api/tasks` to `SELECT * FROM tasks`
  5. Refactor `POST /api/tasks` with parameterized query using `$1, $2, $3` placeholders
  6. Refactor `GET /:id`, `PUT /:id`, `DELETE /:id` with parameterized queries
  7. Add `try-catch` error handling around all database operations
  8. Test all endpoints with Postman — verify data persists in PostgreSQL
- **Expected Output:** All CRUD operations persist to and read from PostgreSQL. Data survives server restarts.
- **Common Pitfall:** Hardcoding credentials instead of using `.env`. Not using parameterized queries (SQL injection risk). Forgetting `async/await` with pool queries.

**Homework (100 points):**
- `pg` library setup with connection pool: 20 pts
- CRUD refactored to use database queries: 30 pts
- Parameterized queries used consistently: 25 pts
- Error handling for database operations: 15 pts
- Postman collection demonstrating persistence: 10 pts

**TaskFlow Milestone:** Connect TaskFlow backend to PostgreSQL. Refactor all task CRUD endpoints to use the database with parameterized queries. Use `dotenv` for `DATABASE_URL`. Tasks should persist across server restarts. Associate tasks with `user_id=1` as a placeholder.

**MIDTERM REVIEW:** Cumulative review of Weeks 1-7 concepts.

---

### Week 8: Midterm Exam

**Objectives Covered:** 1, 2, 3, 4, 5, 7

**Exam Format:** Practical, in-class exam. Students build a small full-stack feature from scratch:
- Create an Express API with 2-3 endpoints
- Connect to a provided PostgreSQL database
- Implement middleware (logging, error handling)
- Build a simple React component that displays data

**No lab or homework this week.**

---

### Week 9: Authentication — bcrypt + JWT

**Objectives Covered:** 6

**Lecture Topics:**
- Authentication vs. authorization
- Password hashing with `bcrypt` (salting, cost factor)
- JSON Web Tokens: structure (header.payload.signature), signing, verification
- Registration flow: validate, hash password, store user
- Login flow: find user, compare hash, generate JWT
- Authentication middleware: extract token, verify, attach user to request
- Token expiration and security best practices

**Lab Exercise (60-90 min):**
- **Objective:** Implement user registration, login, and JWT-protected routes.
- **Steps:**
  1. Install: `npm install bcrypt jsonwebtoken`
  2. Add `JWT_SECRET=your_secret_key_here` to `.env`
  3. Create `POST /api/register` — validate, hash password with `bcrypt.hash(password, 10)`, insert user
  4. Create `POST /api/login` — find user, `bcrypt.compare()`, generate JWT with `jwt.sign()`
  5. Create `authMiddleware.js` — extract Bearer token, `jwt.verify()`, attach `req.userId`
  6. Protect `GET /api/tasks` with the auth middleware
  7. Test: register, login, use token for protected route, try without token (401)
- **Expected Output:** Registration creates user with hashed password. Login returns JWT. Protected routes require valid JWT. Invalid/missing tokens return 401.
- **Common Pitfall:** Storing raw passwords. Not handling token expiration. Exposing `password_hash` in API responses.

**Homework (100 points):**
- `bcrypt` hashing and comparison: 25 pts
- JWT generation and verification: 25 pts
- Register endpoint with validation: 15 pts
- Login endpoint with proper error messages: 15 pts
- Auth middleware protecting routes: 10 pts
- Postman collection with auth flow: 10 pts

**TaskFlow Milestone:** Implement user registration and login. Hash passwords with `bcrypt`, issue JWT tokens on login. Create auth middleware. Protect all `/api/tasks` routes — only authenticated users can access them. Tasks should be scoped to the authenticated user (`WHERE user_id = req.userId`).

---

### Week 10: Frontend Authentication State

**Objectives Covered:** 1, 6, 7

**Lecture Topics:**
- Client-side token storage: localStorage vs. cookies vs. sessionStorage
- Security considerations (XSS, CSRF)
- React Router for navigation (`react-router-dom`)
- Creating an AuthContext with Context API
- Protected route components
- Login/logout UI flows
- Persisting auth state across page refreshes

**Lab Exercise (60-90 min):**
- **Objective:** Build frontend auth with login form, token storage, auth context, and protected routes.
- **Steps:**
  1. Install: `npm install react-router-dom`
  2. Create `src/context/AuthContext.jsx` with `user`, `token`, `isLoggedIn` state and `login`/`logout` functions
  3. Wrap `<App>` with `<AuthProvider>`
  4. Create `src/pages/LoginPage.jsx` with email/password form
  5. On submit: POST to `/api/login`, store token in `localStorage`, call `login()`
  6. Create `src/components/PrivateRoute.jsx` — check `isLoggedIn`, redirect if not
  7. Set up routes: `/login` (public), `/dashboard` (protected)
  8. Add logout button in Header
  9. Test: login stores token, refresh persists session, logout clears everything
- **Expected Output:** Login form authenticates and redirects to dashboard. Refresh keeps user logged in. Logout clears state and redirects. Accessing `/dashboard` while logged out redirects to `/login`.
- **Common Pitfall:** Not checking localStorage on mount (losing auth on refresh). Not clearing both localStorage and context state on logout.

**Homework (100 points):**
- AuthContext with proper state management: 25 pts
- Login form with API integration and token storage: 20 pts
- Logout functionality (clear state + localStorage): 15 pts
- Protected route with redirect: 20 pts
- Auth persistence across page refresh: 10 pts
- Code quality and React best practices: 10 pts

**TaskFlow Milestone:** Build TaskFlow login and registration pages. Create AuthContext for global auth state. Store JWT in localStorage. Implement protected routes — `TaskList` and `TaskInput` are only accessible to authenticated users. Add logout to the Header.

---

### Week 11: Full-Stack Integration

**Objectives Covered:** 1, 3, 5

**Lecture Topics:**
- Making API calls from React: `fetch` vs. `axios`
- Creating an API client with default headers (auth token)
- CORS configuration: origin whitelist, credentials
- Loading states and skeleton UIs
- Error handling patterns: try-catch, error boundaries
- Handling 401 responses (auto-logout)
- Optimistic vs. pessimistic UI updates

**Lab Exercise (60-90 min):**
- **Objective:** Connect the React frontend to the Express backend with authenticated API calls, loading states, and error handling.
- **Steps:**
  1. Install in frontend: `npm install axios`
  2. Create `src/api/client.js` with axios instance and auth interceptor
  3. Configure backend CORS for specific origin (not wildcard)
  4. In `TaskList`, fetch tasks with `api.get('/tasks')` in `useEffect`
  5. Add loading state: show "Loading tasks..." while fetching
  6. Add error state: show error message if request fails
  7. Handle 401 in axios response interceptor — call `logout()` and redirect
  8. Wire up create/update/delete task operations through the API
  9. Test full flow: login, see tasks, add task, edit, delete
- **Expected Output:** Fully functional full-stack app. Loading indicators appear during API calls. Errors display user-friendly messages. 401 triggers automatic logout.
- **Common Pitfall:** CORS errors from mismatched origins. Forgetting to attach auth token to requests. Not handling async state transitions (loading to success/error).

**Homework (100 points):**
- CORS configuration (backend): 15 pts
- Axios client with auth interceptor: 25 pts
- Loading state management: 20 pts
- Error handling with user-friendly messages: 20 pts
- Backend structured error responses: 10 pts
- Full-stack functionality (end-to-end flow): 10 pts

**TaskFlow Milestone:** Fully integrate TaskFlow frontend and backend. Users can register, login, create/view/update/delete their own tasks through the UI. Loading indicators on all API calls. Error messages for failures. 401 auto-logout.

---

### Week 12: Prisma ORM

**Objectives Covered:** 7

**Lecture Topics:**
- ORMs vs. raw SQL: trade-offs
- Prisma architecture: schema, client, migration
- `prisma/schema.prisma` syntax: models, fields, relations
- `npx prisma migrate dev` — creating and applying migrations
- `npx prisma generate` — generating the client
- Prisma Client CRUD methods: `create`, `findMany`, `findUnique`, `update`, `delete`
- Prisma relations: `@relation`, includes, nested writes
- Prisma Studio for database exploration

**Lab Exercise (60-90 min):**
- **Objective:** Replace raw `pg` queries with Prisma ORM.
- **Steps:**
  1. Install: `npm install prisma @prisma/client` and `npx prisma init`
  2. Configure `DATABASE_URL` in `.env`
  3. Define `User` and `Task` models in `prisma/schema.prisma` with relations
  4. Run `npx prisma migrate dev --name init`
  5. Create `src/prisma.js` — instantiate and export PrismaClient
  6. Refactor all routes from `pool.query(...)` to `prisma.task.findMany(...)`, etc.
  7. Test all endpoints — behavior should be identical
  8. Explore data with `npx prisma studio`
- **Expected Output:** All CRUD operations function identically using Prisma instead of raw SQL. Migration files exist in `prisma/migrations/`.
- **Common Pitfall:** Forgetting `npx prisma generate` after schema changes. Schema-database mismatch when migrating existing tables.

**Homework (100 points):**
- Prisma schema with correct models and relations: 25 pts
- Migrations created and applied: 20 pts
- User CRUD refactored to Prisma Client: 25 pts
- Task CRUD refactored to Prisma Client: 20 pts
- Overall functional correctness: 10 pts

**TaskFlow Milestone:** Refactor TaskFlow backend to use Prisma ORM. Define `User` and `Task` models with relations. Migrate the database. Replace all raw `pg` queries with Prisma Client methods. Verify all existing functionality still works.

---

### Week 13: File Uploads + File System Persistence

**Objectives Covered:** 7

**Lecture Topics:**
- File upload concepts: multipart/form-data
- `multer` middleware: disk storage, file filtering, size limits
- File system operations with `fs` module
- Serving static files with `express.static()`
- Security: file type validation, path traversal prevention
- Storing file metadata in the database

**Lab Exercise (60-90 min):**
- **Objective:** Implement file upload with multer, save to disk, serve statically.
- **Steps:**
  1. Install: `npm install multer`
  2. Create `uploads/` directory in project root
  3. Configure multer with disk storage (custom filename with `Date.now()`)
  4. Create `POST /api/upload-avatar` with `upload.single('avatar')`
  5. Return file info: `{ filename, path, mimetype, size }`
  6. Add `app.use('/static', express.static('uploads'))`
  7. Test upload via Postman (form-data, key type "File")
  8. Verify file exists in `uploads/` and is accessible at `/static/filename`
- **Expected Output:** File uploads to `uploads/` directory. File accessible via static URL. File metadata returned in response.
- **Common Pitfall:** Forgetting `enctype="multipart/form-data"` in HTML forms. Incorrect multer storage path. Not adding `uploads/` to `.gitignore`.

**Homework (100 points):**
- Multer setup with disk storage config: 25 pts
- Upload endpoint implementation: 25 pts
- Static file serving configuration: 20 pts
- Files correctly saved and accessible: 15 pts
- File type/size validation: 15 pts

**TaskFlow Milestone:** Add profile picture upload to TaskFlow. Create `POST /api/users/:id/upload-avatar` using multer. Store the filename in the user's database record (via Prisma). Serve uploads statically. Display the avatar on the frontend user profile.

---

### Week 14: Testing + Deployment Preparation

**Objectives Covered:** 2, 5

**Lecture Topics:**
- Why test? Unit vs. integration vs. end-to-end
- Jest fundamentals: describe, it, expect, matchers
- Testing Express APIs with Supertest
- Test database isolation (separate `.env.test`)
- `beforeAll`, `afterAll`, `beforeEach` for setup/teardown
- Environment variables for different environments
- Build scripts and production configuration
- Deployment overview: Render, Railway, Vercel, Heroku

**Lab Exercise (60-90 min):**
- **Objective:** Write unit and integration tests for the Express API.
- **Steps:**
  1. Install: `npm install --save-dev jest supertest`
  2. Add to `package.json`: `"test": "jest --runInBand --forceExit"`
  3. Create `.env.test` pointing to a separate test database
  4. Create `src/utils/validators.js` with `isValidEmail(email)` function
  5. Write unit test in `src/__tests__/validators.test.js`
  6. Write integration tests for `GET /api/tasks` (200), `POST /api/tasks` (201), invalid POST (400)
  7. Add `beforeAll` to set up test database, `afterAll` to clean up
  8. Run `npm test` — all tests should pass
- **Expected Output:** All unit and integration tests pass. Test database is isolated from development data.
- **Common Pitfall:** Tests modifying the development database. Jest hanging due to open database connections (use `--forceExit`). Not using `--runInBand` causing parallel test conflicts.

**Homework (100 points):**
- Jest and Supertest setup: 20 pts
- Unit test(s) for utility functions: 20 pts
- Integration tests for 3+ API endpoints: 30 pts
- Test database isolation: 20 pts
- Start/test scripts in package.json: 10 pts

**TaskFlow Milestone:** Write tests for TaskFlow: unit tests for validators, integration tests for register, login, and all task CRUD endpoints. Configure test database. Ensure all environment-specific values use `dotenv`. Prepare `start` and `test` scripts.

---

### Week 15: Capstone Presentations + Final Review

**Objectives Covered:** All (1-7)

**Final Exam:** Comprehensive practical exam covering all course material, with emphasis on full-stack integration patterns.

**Capstone Presentations (20 min each):**
- Live demo of TaskFlow application
- Code walkthrough of one interesting feature
- Discussion of challenges faced and solutions
- Q&A from instructor and peers

**Capstone Grading Rubric (200 points):**

| Criteria | Points |
|----------|--------|
| User registration and login (bcrypt + JWT) | 30 |
| Task CRUD — full functionality | 30 |
| Database schema design and integrity | 20 |
| RESTful API design (correct methods, status codes) | 20 |
| Middleware usage (auth, validation, error handling) | 20 |
| Frontend UI (React components, state management) | 20 |
| Frontend-backend integration (auth headers, CORS) | 20 |
| File upload functionality | 15 |
| Testing (unit + integration) | 15 |
| Code quality and organization | 10 |

**No lab or homework this week.**

---

## Technology Reference

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18+ | Frontend UI framework |
| Vite | 5+ | Frontend build tool |
| React Router | 6+ | Client-side routing |
| Node.js | 20+ LTS | JavaScript runtime |
| Express.js | 4.x | Backend web framework |
| PostgreSQL | 15+ | Relational database |
| pg | 8.x | PostgreSQL client for Node.js |
| Prisma | 5.x | ORM (database toolkit) |
| bcrypt | 5.x | Password hashing |
| jsonwebtoken | 9.x | JWT authentication |
| multer | 1.x | File upload handling |
| axios | 1.x | HTTP client for frontend |
| cors | 2.x | Cross-origin resource sharing |
| dotenv | 16.x | Environment variable management |
| Jest | 29.x | Testing framework |
| Supertest | 6.x | HTTP assertion library |
| Postman | — | API testing tool |

---

## Recommended Textbooks & Resources

- **MDN Web Docs** — JavaScript, HTTP, Web APIs reference
- **React Official Docs** — react.dev (new docs with hooks-first approach)
- **Express.js Guide** — expressjs.com
- **Prisma Docs** — prisma.io/docs
- **PostgreSQL Tutorial** — postgresqltutorial.com
- **"Fullstack React"** by Accomazzo, Murray, Lerner
- **"Node.js Design Patterns"** by Casciaro, Mammino

---

## Academic Integrity

All code submitted must be the student's own work. Use of AI assistants (ChatGPT, Claude, Copilot) is permitted for learning and debugging but not for generating entire assignments. Students must be able to explain every line of code they submit.
