/**
 * =============================================================
 * TASK ROUTES - CRUD Operations with User Scoping
 * =============================================================
 *
 * All routes are protected by auth middleware (applied in app.js).
 * Every query is scoped to the authenticated user (req.user.id),
 * so users can only see and modify their own tasks.
 *
 * ENDPOINTS:
 *   GET    /api/tasks          - List all tasks for the user
 *   GET    /api/tasks/:id      - Get a single task by ID
 *   POST   /api/tasks          - Create a new task
 *   PUT    /api/tasks/:id      - Update a task
 *   PATCH  /api/tasks/:id      - Partially update a task (e.g., toggle status)
 *   DELETE /api/tasks/:id      - Delete a task
 *
 * KEY CONCEPTS:
 *   - User scoping: WHERE userId = req.user.id
 *   - Input validation before database operations
 *   - Prisma query methods: findMany, findFirst, create, update, delete
 *   - Query parameters for filtering and sorting
 *   - Consistent response format
 * =============================================================
 */

const express = require('express');
const prisma = require('../prisma');

const router = express.Router();

// Valid values for status and priority fields
const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * GET /api/tasks
 *
 * List all tasks for the authenticated user.
 * Supports filtering by status and priority via query parameters.
 *
 * Query parameters:
 *   ?status=pending         - Filter by status
 *   ?priority=high          - Filter by priority
 *   ?sort=createdAt         - Sort field (createdAt, title, priority)
 *   ?order=desc             - Sort order (asc, desc)
 *
 * Example: GET /api/tasks?status=pending&sort=createdAt&order=desc
 */
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, sort = 'createdAt', order = 'desc' } = req.query;

    // Build the WHERE clause dynamically based on query params
    const where = {
      userId: req.user.id, // Always scope to the authenticated user
    };

    // Add optional filters if provided
    if (status && VALID_STATUSES.includes(status)) {
      where.status = status;
    }

    if (priority && VALID_PRIORITIES.includes(priority)) {
      where.priority = priority;
    }

    // Validate sort parameters
    const validSortFields = ['createdAt', 'updatedAt', 'title', 'status', 'priority'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    // Query the database with Prisma
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
    });

    res.json({
      tasks,
      count: tasks.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tasks/:id
 *
 * Get a single task by its ID.
 * The task must belong to the authenticated user.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    // Validate that the ID is a number
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
    }

    // findFirst with both id AND userId ensures user can only see their tasks
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.user.id, // User scoping - critical for security!
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tasks
 *
 * Create a new task for the authenticated user.
 *
 * Request body: { title, description?, status?, priority? }
 * Response: { message, task }
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;

    // --- Validation ---
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({ error: 'Title must be under 200 characters.' });
    }

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    // Validate priority if provided
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
      });
    }

    // --- Create the task ---
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'pending',
        priority: priority || 'medium',
        userId: req.user.id, // Associate with the authenticated user
      },
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/tasks/:id
 *
 * Full update of a task (replace all fields).
 * The task must belong to the authenticated user.
 *
 * Request body: { title, description?, status?, priority? }
 */
router.put('/:id', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
    }

    const { title, description, status, priority } = req.body;

    // Title is required for full update
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
      });
    }

    // Verify the task belongs to the user before updating
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Update the task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'pending',
        priority: priority || 'medium',
      },
    });

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/tasks/:id
 *
 * Partial update - only updates the fields that are provided.
 * Useful for toggling status without sending the entire task.
 *
 * Request body: Any subset of { title, description, status, priority }
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
    }

    // Build update data from only the provided fields
    const updateData = {};
    const { title, description, status, priority } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ error: 'Title cannot be empty.' });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        });
      }
      updateData.status = status;
    }

    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({
          error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
        });
      }
      updateData.priority = priority;
    }

    // Verify the task belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Update only the provided fields
    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/tasks/:id
 *
 * Delete a task. The task must belong to the authenticated user.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
    }

    // Verify the task belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Delete the task
    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
