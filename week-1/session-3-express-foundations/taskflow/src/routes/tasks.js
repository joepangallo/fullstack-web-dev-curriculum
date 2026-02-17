/**
 * tasks.js - Task Routes (Express Router)
 * =========================================
 * All routes for the /api/tasks endpoint are defined here.
 *
 * What is Express Router?
 *   Router is like a "mini Express app" for organizing related routes.
 *   Instead of defining routes directly on `app`, we create a Router
 *   and define routes on it. Then we "mount" the Router in app.js:
 *
 *     const taskRoutes = require('./routes/tasks');
 *     app.use('/api/tasks', taskRoutes);
 *
 *   This means:
 *     router.get('/')     -> handles GET /api/tasks
 *     router.get('/:id')  -> handles GET /api/tasks/:id
 *     router.post('/')    -> handles POST /api/tasks
 *     etc.
 *
 * Why Use Router?
 *   1. Organization — Group related routes together
 *   2. Modularity — Each route file can be developed and tested independently
 *   3. Route-Specific Middleware — Apply middleware only to certain routes
 *      (like our validation middleware on POST and PUT, but not GET or DELETE)
 *
 * REST API Design:
 *   GET    /api/tasks      -> Get all tasks
 *   GET    /api/tasks/:id  -> Get one task by ID
 *   POST   /api/tasks      -> Create a new task
 *   PUT    /api/tasks/:id  -> Update an existing task
 *   DELETE /api/tasks/:id  -> Delete a task
 */

const express = require('express');
const router = express.Router();

// Import validation middleware
const { validateTaskCreation, validateTaskUpdate } = require('../middleware/validate');

// ===== In-Memory Data Store =====
/**
 * Sample tasks with realistic data.
 * In a real application, this would be a database (PostgreSQL, MongoDB, etc.)
 */
let tasks = [
  {
    id: 1,
    title: 'Initialize project with Vite + React',
    description: 'Set up the frontend development environment with Vite bundler and React 18.',
    status: 'completed',
    createdAt: '2024-01-15T09:00:00.000Z',
  },
  {
    id: 2,
    title: 'Build component hierarchy',
    description: 'Create reusable Header, Footer, TaskCard, and TaskInput components with proper props.',
    status: 'completed',
    createdAt: '2024-01-16T10:30:00.000Z',
  },
  {
    id: 3,
    title: 'Implement state management',
    description: 'Add useState and useEffect hooks for task CRUD operations and form handling.',
    status: 'in-progress',
    createdAt: '2024-01-17T14:00:00.000Z',
  },
  {
    id: 4,
    title: 'Build Express REST API',
    description: 'Create the backend API with Express.js, including routes, middleware, and validation.',
    status: 'in-progress',
    createdAt: '2024-01-18T08:00:00.000Z',
  },
  {
    id: 5,
    title: 'Connect frontend to backend',
    description: 'Replace in-memory data with fetch() calls to the Express API endpoints.',
    status: 'pending',
    createdAt: '2024-01-19T11:00:00.000Z',
  },
];

// Simple counter for generating unique IDs
let nextId = 6;

// ===== Route Handlers =====

/**
 * GET / — Get all tasks
 * (Mounted at /api/tasks, so this handles GET /api/tasks)
 *
 * Supports optional query parameter for filtering:
 *   GET /api/tasks?status=pending
 *   GET /api/tasks?status=completed
 *
 * Query parameters are different from route parameters:
 *   Route params:  /api/tasks/:id     -> req.params.id
 *   Query params:  /api/tasks?status=x -> req.query.status
 */
router.get('/', (req, res) => {
  // Check for optional status filter in query string
  const { status } = req.query;

  // If status query param provided, filter tasks
  if (status) {
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status filter. Must be one of: ${validStatuses.join(', ')}`,
      });
    }
    const filteredTasks = tasks.filter((task) => task.status === status);
    return res.json(filteredTasks);
  }

  // No filter — return all tasks
  res.json(tasks);
});

/**
 * GET /:id — Get a single task by ID
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  res.json(task);
});

/**
 * POST / — Create a new task
 *
 * Notice the middleware chain: validateTaskCreation runs FIRST.
 * If validation fails, the route handler never executes.
 * If validation passes (next() is called), the route handler runs.
 *
 *   router.post('/', middleware1, middleware2, routeHandler)
 *   Each function in the chain can either:
 *     - Send a response (ending the chain)
 *     - Call next() (passing to the next function)
 */
router.post('/', validateTaskCreation, (req, res) => {
  const { title, description, status } = req.body;

  const newTask = {
    id: nextId++,                                    // Increment ID counter
    title: title.trim(),
    description: description ? description.trim() : '',
    status: status || 'pending',                     // Default to 'pending' if not specified
    createdAt: new Date().toISOString(),              // ISO 8601 timestamp
  };

  tasks.push(newTask);

  // 201 Created — return the new task with its generated ID and timestamp
  res.status(201).json(newTask);
});

/**
 * PUT /:id — Update an existing task
 *
 * Uses validateTaskUpdate middleware for validation.
 * Only updates fields that are provided in the request body.
 */
router.put('/:id', validateTaskUpdate, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, description, status } = req.body;

  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  // Update only the fields that were provided
  // The spread operator (...) copies all existing properties,
  // then we override only the specified ones
  tasks[index] = {
    ...tasks[index],
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(status !== undefined && { status }),
  };

  res.json(tasks[index]);
});

/**
 * DELETE /:id — Delete a task
 *
 * Returns 204 No Content on success (the standard for DELETE operations).
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  // Remove the task from the array
  tasks.splice(index, 1);

  // 204 No Content — successful deletion
  res.status(204).send();
});

// Export the router so app.js can mount it
module.exports = router;
