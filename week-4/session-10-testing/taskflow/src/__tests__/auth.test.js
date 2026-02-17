// ============================================
// TaskFlow - Integration Tests: Authentication
// ============================================
// Tests for the TaskFlow auth endpoints.
// Same structure as the lab version, testing:
//   - POST /api/auth/register
//   - POST /api/auth/login
//
// See the lab version for detailed comments.
// ============================================

const request = require('supertest');
const { app, prisma } = require('../app');

beforeAll(async () => {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

// ============================================
// POST /api/auth/register
// ============================================
describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it('should register a new user successfully (201)', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'alice@taskflow.com',
        password: 'alice123',
        username: 'alice'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email', 'alice@taskflow.com');
    expect(response.body.user).toHaveProperty('username', 'alice');
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('should return 409 for duplicate email', async () => {
    // Register first
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'bob@taskflow.com', password: 'bob12345' });

    // Try again with same email
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bob@taskflow.com', password: 'different1' });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error', 'Email already registered');
  });

  it('should return 400 when email is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ password: 'noEmail1' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 when password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nopass@taskflow.com' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 when body is empty', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});

    expect(response.status).toBe(400);
  });
});

// ============================================
// POST /api/auth/login
// ============================================
describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});

    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'loginuser@taskflow.com',
        password: 'login123',
        username: 'loginuser'
      });
  });

  it('should login successfully and return a token (200)', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'loginuser@taskflow.com',
        password: 'login123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('loginuser@taskflow.com');
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('should return 401 for wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'loginuser@taskflow.com',
        password: 'wrongpass1'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid email or password');
  });

  it('should return 401 for non-existent email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ghost@taskflow.com',
        password: 'password123'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid email or password');
  });

  it('should return 400 when email is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: 'login123' });

    expect(response.status).toBe(400);
  });

  it('should return 400 when password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'loginuser@taskflow.com' });

    expect(response.status).toBe(400);
  });
});
