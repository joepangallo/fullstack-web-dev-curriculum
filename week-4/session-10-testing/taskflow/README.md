# TaskFlow - Testing Strategy

## Overview

This directory contains the complete test suite for the TaskFlow backend application. Our testing strategy uses a layered approach with **unit tests** and **integration tests**.

## Test Types

### Unit Tests (`validators.test.js`)
- Test individual functions in isolation
- No database or network required
- Extremely fast to run
- Test all input types: valid, invalid, edge cases, and wrong types

### Integration Tests (`auth.test.js`, `tasks.test.js`)
- Test the full HTTP request/response cycle
- Require a running test database
- Test real interactions between Express, Prisma, and PostgreSQL
- Verify status codes, response bodies, and error handling

## Test Organization

```
src/
  __tests__/
    setup.js             # Database cleanup utilities
    validators.test.js   # Unit tests for validator functions
    auth.test.js         # Integration tests for auth endpoints
    tasks.test.js        # Integration tests for task CRUD
  utils/
    validators.js        # Validator functions being tested
  app.js                 # Express app (exported for Supertest)
```

## Running Tests

### Prerequisites
1. Create a test database:
   ```bash
   psql -U postgres -c "CREATE DATABASE taskflow_test;"
   ```

2. Run migrations against the test database:
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow_test" npx prisma migrate dev
   ```

### Commands
```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run with verbose output (shows each test name)
npm run test:verbose

# Run a specific test file
npx jest src/__tests__/validators.test.js --runInBand --forceExit
```

## Key Testing Patterns

### 1. Test Database Isolation
- Tests use `.env.test` with a separate `DATABASE_URL`
- The test database is cleaned between test runs
- **Never** point tests at your development database!

### 2. Supertest (No Server Required)
- Supertest wraps the Express app directly
- No need to call `app.listen()` -- Supertest handles it
- This is why `app.js` exports the app without starting the server

### 3. Sequential CRUD Tests
- Task tests run in order: Create, Read, Update, Delete
- Use `--runInBand` flag to prevent parallel execution
- Save IDs from create responses for use in later tests

### 4. Authentication in Tests
- Register a test user in `beforeAll`
- Save the JWT token in a variable
- Pass the token via `set('Authorization', 'Bearer ...')` in each request

### 5. Ownership Tests
- Critical security tests: users should only access their own tasks
- Create two users and verify one cannot access the other's tasks
- Return 404 (not 403) to prevent information disclosure

## Test Coverage Goals

| Area            | Target |
|-----------------|--------|
| Validators      | 100%   |
| Auth endpoints  | 90%+   |
| Task endpoints  | 90%+   |
| Error handling  | 80%+   |

## Common Issues

| Problem | Solution |
|---------|----------|
| "Cannot find module '@prisma/client'" | Run `npx prisma generate` |
| "relation does not exist" | Run migrations: `npx prisma migrate dev` |
| Tests hang / don't finish | Ensure `--forceExit` flag is used |
| "Port already in use" | Make sure `app.js` does not call `app.listen()` when imported |
| Wrong database being used | Check that `.env.test` has the correct `DATABASE_URL` |
