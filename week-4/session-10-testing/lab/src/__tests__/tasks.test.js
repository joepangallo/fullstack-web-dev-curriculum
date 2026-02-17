// ============================================
// Integration Tests: Task CRUD Endpoints
// ============================================
// These tests verify the full task lifecycle:
//   Create -> Read (list & single) -> Update -> Delete
//
// Key testing pattern used here:
//   1. Set up test data in beforeAll (register user, get token)
//   2. Tests run in ORDER (--runInBand flag)
//   3. Later tests depend on data created by earlier tests
//
// This is an intentional design choice for CRUD tests:
// it mirrors how users actually interact with the API.
//
// Note: For unit tests, each test should be independent.
// For integration/e2e tests, sequential tests are common.
// ============================================

const request = require('supertest');
const { app, prisma } = require('../app');

// ============================================
// Shared State
// ============================================
// These variables are set in beforeAll and used across tests.
// This lets us:
//   - Register a user once and reuse the token
//   - Track the ID of a created task to test GET/PUT/DELETE

let authToken;       // JWT token for authenticated requests
let createdTaskId;   // ID of the task we create in POST tests

// ============================================
// Test Lifecycle
// ============================================

beforeAll(async () => {
  // 1. Clean the database
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Register a test user and save the token
  //    We use the API (not Prisma directly) to ensure
  //    the password is properly hashed
  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'taskuser@test.com',
      password: 'testpass1',
      username: 'taskuser'
    });

  // Save the token for authenticated requests
  authToken = registerResponse.body.token;

  // Sanity check: make sure registration worked
  expect(authToken).toBeDefined();
});

afterAll(async () => {
  // Clean up and disconnect
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

// ============================================
// GET /api/tasks - List all tasks
// ============================================
describe('GET /api/tasks', () => {
  it('should return an empty array when user has no tasks', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    // Response should be an array
    expect(Array.isArray(response.body)).toBe(true);
    // Should be empty since we haven't created any tasks yet
    expect(response.body).toHaveLength(0);
  });

  it('should return 401 without authentication', async () => {
    // Sending a request WITHOUT the Authorization header
    const response = await request(app)
      .get('/api/tasks');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 403 with an invalid token', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', 'Bearer invalidtoken123');

    expect(response.status).toBe(403);
  });
});

// ============================================
// POST /api/tasks - Create a task
// ============================================
describe('POST /api/tasks', () => {
  it('should create a new task and return 201', async () => {
    const taskData = {
      title: 'Write unit tests',
      description: 'Cover all validator functions with tests',
      status: 'pending'
    };

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    expect(response.status).toBe(201);

    // Verify the response body contains the task data
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', 'Write unit tests');
    expect(response.body).toHaveProperty('description', 'Cover all validator functions with tests');
    expect(response.body).toHaveProperty('status', 'pending');
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('createdAt');

    // Save the task ID for later tests (GET by ID, PUT, DELETE)
    createdTaskId = response.body.id;
  });

  it('should create a task with only a title (description optional)', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Minimal task' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Minimal task');
    // Description should be null when not provided
    expect(response.body.description).toBeNull();
    // Status should default to 'pending'
    expect(response.body.status).toBe('pending');
  });

  it('should return 400 when title is missing', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        description: 'A task without a title'
        // No title!
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Title is required');
  });

  it('should return 400 when body is empty', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Unauthorized task' });

    expect(response.status).toBe(401);
  });
});

// ============================================
// GET /api/tasks/:id - Get a single task
// ============================================
describe('GET /api/tasks/:id', () => {
  it('should return the task when it exists', async () => {
    const response = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdTaskId);
    expect(response.body).toHaveProperty('title', 'Write unit tests');
  });

  it('should return 404 for a non-existent task', async () => {
    // Use an ID that definitely doesn't exist
    const response = await request(app)
      .get('/api/tasks/99999')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Task not found');
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .get(`/api/tasks/${createdTaskId}`);

    expect(response.status).toBe(401);
  });
});

// ============================================
// PUT /api/tasks/:id - Update a task
// ============================================
describe('PUT /api/tasks/:id', () => {
  it('should update the task title', async () => {
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Write integration tests' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Write integration tests');
    // Other fields should remain unchanged
    expect(response.body).toHaveProperty('status', 'pending');
  });

  it('should update the task status', async () => {
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'in-progress' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'in-progress');
    // Title should still be the updated value from previous test
    expect(response.body).toHaveProperty('title', 'Write integration tests');
  });

  it('should update multiple fields at once', async () => {
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'All tests passing',
        description: 'Updated description',
        status: 'completed'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'All tests passing');
    expect(response.body).toHaveProperty('description', 'Updated description');
    expect(response.body).toHaveProperty('status', 'completed');
  });

  it('should return 404 for a non-existent task', async () => {
    const response = await request(app)
      .put('/api/tasks/99999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Ghost task' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Task not found');
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .send({ title: 'Unauthorized update' });

    expect(response.status).toBe(401);
  });
});

// ============================================
// DELETE /api/tasks/:id - Delete a task
// ============================================
describe('DELETE /api/tasks/:id', () => {
  it('should delete the task and return 204', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    // 204 No Content - successful deletion
    expect(response.status).toBe(204);

    // Verify the task is actually gone
    const getResponse = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(getResponse.status).toBe(404);
  });

  it('should return 404 when deleting an already-deleted task', async () => {
    // Try to delete the same task again
    const response = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
  });

  it('should return 404 for a non-existent task', async () => {
    const response = await request(app)
      .delete('/api/tasks/99999')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Task not found');
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${createdTaskId}`);

    expect(response.status).toBe(401);
  });
});

// ============================================
// Task Ownership Tests
// ============================================
// Verify that users can only see/modify their OWN tasks.
// This is a critical security test!
describe('Task Ownership', () => {
  let otherUserToken;
  let userATaskId;

  beforeAll(async () => {
    // Create another user
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'otheruser@test.com',
        password: 'otherpass1',
        username: 'otheruser'
      });
    otherUserToken = response.body.token;

    // Create a task as the original user
    const taskResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'User A private task' });
    userATaskId = taskResponse.body.id;
  });

  it('should not let another user view a task they do not own', async () => {
    const response = await request(app)
      .get(`/api/tasks/${userATaskId}`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    // The other user should get 404 (not 403)
    // We return 404 instead of 403 to avoid revealing
    // that the task exists (information disclosure)
    expect(response.status).toBe(404);
  });

  it('should not let another user update a task they do not own', async () => {
    const response = await request(app)
      .put(`/api/tasks/${userATaskId}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({ title: 'Hacked title!' });

    expect(response.status).toBe(404);
  });

  it('should not let another user delete a task they do not own', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${userATaskId}`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(response.status).toBe(404);
  });

  it('should only show tasks belonging to the authenticated user', async () => {
    // Create a task as the other user
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({ title: 'User B task' });

    // List tasks as the original user
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    // All returned tasks should belong to the authenticated user
    response.body.forEach((task) => {
      expect(task.title).not.toBe('User B task');
    });
  });
});
