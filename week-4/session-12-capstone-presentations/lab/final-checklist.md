# Final Submission Checklist

Use this checklist to make sure your capstone project is complete before submitting. Check off each item as you verify it.

---

## Functionality

### Authentication
- [ ] User can register with email and password
- [ ] User can log in with correct credentials
- [ ] Login returns a JWT token
- [ ] Invalid credentials show appropriate error messages
- [ ] User can log out (token cleared from storage)
- [ ] Protected routes redirect to login when not authenticated

### Task CRUD Operations
- [ ] **Create:** User can create a new task with title and description
- [ ] **Read:** User can view a list of all their tasks
- [ ] **Read:** User can view a single task's details
- [ ] **Update:** User can edit a task's title, description, and status
- [ ] **Delete:** User can delete a task
- [ ] Tasks are scoped to the authenticated user (users cannot see other users' tasks)

### File Uploads (if implemented)
- [ ] User can upload a file (e.g., profile avatar or task attachment)
- [ ] Uploaded files are stored correctly
- [ ] Files are accessible/downloadable after upload

---

## Backend

### API Endpoints
- [ ] `POST /api/auth/register` - Returns 201 with user + token
- [ ] `POST /api/auth/login` - Returns 200 with user + token
- [ ] `GET /api/tasks` - Returns 200 with array of tasks
- [ ] `POST /api/tasks` - Returns 201 with created task
- [ ] `GET /api/tasks/:id` - Returns 200 with single task
- [ ] `PUT /api/tasks/:id` - Returns 200 with updated task
- [ ] `DELETE /api/tasks/:id` - Returns 204 (no content)
- [ ] `GET /api/health` - Returns 200 (health check)

### Error Handling
- [ ] Missing required fields return 400
- [ ] Unauthorized requests return 401
- [ ] Duplicate email registration returns 409
- [ ] Non-existent resources return 404
- [ ] Server errors return 500 (not crash the app)

### Security
- [ ] Passwords are hashed with bcrypt (NEVER stored as plain text)
- [ ] JWT tokens have an expiration time
- [ ] Auth middleware protects task routes
- [ ] Users can only access their own tasks
- [ ] No sensitive data in API responses (no password fields)

---

## Frontend

### Pages/Components
- [ ] Login page with form
- [ ] Registration page with form
- [ ] Task list page (dashboard)
- [ ] Create task form
- [ ] Edit task form or inline editing
- [ ] Navigation bar with login/logout

### User Experience
- [ ] Loading states shown during API calls
- [ ] Error messages displayed for failed operations
- [ ] Success feedback after actions (toast, redirect, or message)
- [ ] Form validation on the client side
- [ ] Responsive layout (works on mobile and desktop)

### State Management
- [ ] Auth state managed with React Context (or equivalent)
- [ ] Token stored in localStorage
- [ ] Token sent in Authorization header for API calls
- [ ] State updates after CRUD operations (no stale data)

---

## Testing

### Unit Tests
- [ ] `validators.test.js` tests all validator functions
- [ ] Tests cover valid inputs, invalid inputs, and edge cases
- [ ] Tests cover non-string input types (null, undefined, numbers)

### Integration Tests
- [ ] `auth.test.js` tests register and login endpoints
- [ ] `tasks.test.js` tests full CRUD lifecycle
- [ ] Tests use a separate test database (`.env.test`)
- [ ] Tests clean up after themselves (beforeAll/afterAll)

### Running Tests
- [ ] `npm test` runs all tests without errors
- [ ] All tests pass (green)
- [ ] No console errors or warnings during test runs

---

## Documentation

### README.md
- [ ] Project title and description
- [ ] Prerequisites (Node.js, PostgreSQL, etc.)
- [ ] Step-by-step setup instructions
- [ ] How to install dependencies
- [ ] How to set up the database
- [ ] How to run the development server
- [ ] How to run tests
- [ ] Environment variables reference (what each one does)
- [ ] API endpoint documentation

### Code Comments
- [ ] Complex logic has explanatory comments
- [ ] Functions have brief descriptions of what they do
- [ ] No commented-out dead code left in the project

---

## Git and Version Control

### Repository
- [ ] Code is pushed to a GitHub repository
- [ ] Repository has a descriptive name
- [ ] Repository is accessible to the instructor

### Git History
- [ ] Multiple commits (not just one giant commit)
- [ ] Commit messages are descriptive (not "update" or "fix stuff")
- [ ] Logical progression of features in commit history

### Files NOT Committed (check .gitignore)
- [ ] `node_modules/` is NOT in the repository
- [ ] `.env` files are NOT in the repository
- [ ] `.env.test` is NOT in the repository
- [ ] `uploads/` directory contents are NOT in the repository (empty dir with .gitkeep is OK)
- [ ] No API keys, passwords, or secrets anywhere in the code or git history

### .gitignore Includes
- [ ] `node_modules/`
- [ ] `.env`
- [ ] `.env.test`
- [ ] `.env.local`
- [ ] `coverage/`
- [ ] `.DS_Store`
- [ ] `uploads/*`

---

## Deployment (Bonus)

- [ ] Application is deployed and accessible via a public URL
- [ ] Dockerfile builds successfully
- [ ] Docker Compose starts all services
- [ ] Database migrations run in production
- [ ] Environment variables are configured in the deployment platform (not hardcoded)

---

## Final Steps Before Submitting

1. [ ] Pull your latest code and do a fresh `npm install` + `npm test` to verify
2. [ ] Try setting up your project from scratch using only your README
3. [ ] Test every feature one more time in the browser
4. [ ] Make sure your GitHub repo URL is correct
5. [ ] Prepare your presentation (see `presentation-guide.md`)

---

**Remember:** A working project with clean code and good documentation is more impressive than a feature-rich project that is broken or hard to understand. Focus on quality over quantity.
