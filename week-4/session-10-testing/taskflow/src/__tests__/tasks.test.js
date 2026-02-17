// ============================================
// TaskFlow - Integration Tests: Task CRUD
// ============================================
// Tests for TaskFlow task endpoints.
// Extends the lab tests with TaskFlow-specific fields:
//   - priority (low, medium, high)
//   - dueDate (optional ISO date string)
//
// Tests run sequentially (--runInBand):
//   Create -> Read -> Update -> Delete
// ============================================

const request = require('supertest');
const { app, prisma } = require('../app');

let authToken;
let createdTaskId;

beforeAll(async () => {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});

  // Register a test user
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'tasktest@taskflow.com',
      password: 'tasks123',
      username: 'taskuser'
    });

  authToken = response.body.token;
  expect(authToken).toBeDefined();
});

afterAll(async () => {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

// ============================================
// GET /api/tasks - List tasks
// ============================================
describe('GET /api/tasks', () => {
  it('should return an empty array initially (200)', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(401);
  });
});

// ============================================
// POST /api/tasks - Create tasks
// ============================================
describe('POST /api/tasks', () => {
  it('should create a task with all fields (201)', async () => {
    const taskData = {
      title: 'Build login page',
      description: 'Create React login form with email and password fields',
      status: 'pending',
      priority: 'high',
      dueDate: '2027-06-15T00:00:00.000Z'
    };

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', 'Build login page');
    expect(response.body).toHaveProperty('description', taskData.description);
    expect(response.body).toHaveProperty('status', 'pending');
    expect(response.body).toHaveProperty('priority', 'high');
    expect(response.body).toHaveProperty('dueDate');
    expect(response.body).toHaveProperty('createdAt');

    createdTaskId = response.body.id;
  });

  it('should create a task with only title (defaults applied)', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Quick task' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Quick task');
    expect(response.body.description).toBeNull();
    expect(response.body.status).toBe('pending');
    expect(response.body.priority).toBe('medium');
    expect(response.body.dueDate).toBeNull();
  });

  it('should return 400 when title is missing', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ description: 'No title here' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Title is required');
  });

  it('should return 400 for invalid priority', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Bad priority', priority: 'urgent' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Priority must be low, medium, or high');
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Unauthorized' });

    expect(response.status).toBe(401);
  });
});

// ============================================
// GET /api/tasks/:id - Get a single task
// ============================================
describe('GET /api/tasks/:id', () => {
  it('should return the task by ID (200)', async () => {
    const response = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdTaskId);
    expect(response.body).toHaveProperty('title', 'Build login page');
    expect(response.body).toHaveProperty('priority', 'high');
  });

  it('should return 404 for a non-existent task', async () => {
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
  it('should update the task status (200)', async () => {
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'in-progress' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'in-progress');
    expect(response.body).toHaveProperty('title', 'Build login page');
  });

  it('should update the task priority (200)', async () => {
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ priority: 'low' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('priority', 'low');
  });

  it('should update multiple fields at once', async () => {
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Build login page (v2)',
        status: 'completed',
        priority: 'medium'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Build login page (v2)');
    expect(response.body).toHaveProperty('status', 'completed');
    expect(response.body).toHaveProperty('priority', 'medium');
  });

  it('should return 400 for invalid priority', async () => {
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ priority: 'super-high' });

    expect(response.status).toBe(400);
  });

  it('should return 404 for a non-existent task', async () => {
    const response = await request(app)
      .put('/api/tasks/99999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Ghost task' });

    expect(response.status).toBe(404);
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .send({ title: 'Unauthorized' });

    expect(response.status).toBe(401);
  });
});

// ============================================
// DELETE /api/tasks/:id - Delete a task
// ============================================
describe('DELETE /api/tasks/:id', () => {
  it('should delete the task (204)', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(204);

    // Verify it is gone
    const getResponse = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(getResponse.status).toBe(404);
  });

  it('should return 404 for an already-deleted task', async () => {
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
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${createdTaskId}`);

    expect(response.status).toBe(401);
  });
});

// ============================================
// Task Ownership
// ============================================
describe('Task Ownership', () => {
  let otherUserToken;
  let userATaskId;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'other@taskflow.com',
        password: 'other123',
        username: 'otheruser'
      });
    otherUserToken = response.body.token;

    const taskResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Private task', priority: 'high' });
    userATaskId = taskResponse.body.id;
  });

  it('should not let another user view a task they do not own', async () => {
    const response = await request(app)
      .get(`/api/tasks/${userATaskId}`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(response.status).toBe(404);
  });

  it('should not let another user update a task they do not own', async () => {
    const response = await request(app)
      .put(`/api/tasks/${userATaskId}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({ title: 'Hacked!' });

    expect(response.status).toBe(404);
  });

  it('should not let another user delete a task they do not own', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${userATaskId}`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(response.status).toBe(404);
  });
});
