// ============================================
// Integration Tests: Authentication Endpoints
// ============================================
// These are INTEGRATION TESTS - they test how multiple
// parts of our system work together:
//   Express app + Routes + Prisma + Database
//
// Integration tests vs Unit tests:
//   Unit tests:        Test ONE function in isolation
//   Integration tests: Test the full request/response cycle
//
// We use Supertest to make HTTP requests to our Express app
// without actually starting the server on a port.
//
// Supertest provides:
//   request(app).get('/path')    - GET request
//   request(app).post('/path')   - POST request
//   .send({ data })              - Request body
//   .set('Header', 'value')      - Set headers
//   .expect(statusCode)          - Assert status code
//   .expect(callback)            - Custom assertions
// ============================================

const request = require('supertest');
const { app, prisma } = require('../app');

// ============================================
// Test Lifecycle Hooks
// ============================================
// These run at specific times during the test suite:
//   beforeAll:  Once before ALL tests in this file
//   afterAll:   Once after ALL tests in this file
//   beforeEach: Before EACH individual test
//   afterEach:  After EACH individual test

beforeAll(async () => {
  // Clear the database before running auth tests
  // This ensures a clean slate every time
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  // Clean up: remove test data and close the database connection
  // Without this, Jest warns about open handles
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

// ============================================
// POST /api/auth/register
// ============================================
describe('POST /api/auth/register', () => {

  // Clean up users before each test in this block
  // so tests don't interfere with each other
  beforeEach(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});
  });

  // ----- Success case -----
  it('should register a new user and return 201', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@test.com',
        password: 'password123',
        username: 'newuser'
      });

    // Assert the status code
    expect(response.status).toBe(201);

    // Assert the response body structure
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');

    // Assert user data (password should NOT be included!)
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email', 'newuser@test.com');
    expect(response.body.user).toHaveProperty('username', 'newuser');
    expect(response.body.user).not.toHaveProperty('password');

    // Assert the token is a valid JWT format (three dot-separated parts)
    const tokenParts = response.body.token.split('.');
    expect(tokenParts).toHaveLength(3);
  });

  it('should register a user without a username', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'nousername@test.com',
        password: 'password123'
        // No username provided - should still work
      });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('nousername@test.com');
    // Username should be null when not provided
    expect(response.body.user.username).toBeNull();
  });

  // ----- Duplicate email -----
  it('should return 409 when email is already registered', async () => {
    // First, register a user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'duplicate@test.com',
        password: 'password123'
      });

    // Try to register with the same email
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'duplicate@test.com',
        password: 'differentpassword1'
      });

    // Should get 409 Conflict
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error', 'Email already registered');
  });

  // ----- Missing fields -----
  it('should return 400 when email is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        password: 'password123'
        // No email!
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 when password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'nopassword@test.com'
        // No password!
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 when body is empty', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});

// ============================================
// POST /api/auth/login
// ============================================
describe('POST /api/auth/login', () => {
  // Register a user before testing login
  // We need a user in the database to test logging in
  beforeAll(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});

    // Register a test user via the API
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'logintest@test.com',
        password: 'testpass1',
        username: 'loginuser'
      });
  });

  // ----- Success case -----
  it('should login successfully and return a token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'logintest@test.com',
        password: 'testpass1'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('logintest@test.com');
    // Password should NEVER be in the response
    expect(response.body.user).not.toHaveProperty('password');
  });

  // ----- Wrong password -----
  it('should return 401 for wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'logintest@test.com',
        password: 'wrongpassword1'
      });

    expect(response.status).toBe(401);
    // Note: the error message is intentionally vague
    // We don't say "wrong password" because that tells
    // an attacker the email exists in our database
    expect(response.body).toHaveProperty('error', 'Invalid email or password');
  });

  // ----- Non-existent user -----
  it('should return 401 for non-existent email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@test.com',
        password: 'password123'
      });

    expect(response.status).toBe(401);
    // Same error message as wrong password (prevents user enumeration)
    expect(response.body).toHaveProperty('error', 'Invalid email or password');
  });

  // ----- Missing fields -----
  it('should return 400 when email is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 when password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'logintest@test.com'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
