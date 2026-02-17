// ============================================
// Session 6 Lab: Task Routes (Authenticated)
// ============================================
// Updated from Session 5: All routes now require authentication.
// The authenticate middleware verifies the JWT token and provides req.userId.
// Tasks are automatically scoped to the authenticated user.
//
// KEY CHANGES FROM SESSION 5:
// 1. All routes use the 'authenticate' middleware
// 2. Tasks are filtered by req.userId (users only see their own tasks)
// 3. No need to send userId in the request body - it comes from the token
// 4. Users can only modify/delete their own tasks
//
// Route summary:
//   GET    /api/tasks      - Get MY tasks (authenticated user only)
//   GET    /api/tasks/:id  - Get one of MY tasks
//   POST   /api/tasks      - Create a task (assigned to me)
//   PUT    /api/tasks/:id  - Update one of MY tasks
//   DELETE /api/tasks/:id  - Delete one of MY tasks
// ============================================

const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma');
const authenticate = require('../middleware/auth');
const { validateTask } = require('../middleware/validate');

// ============================================
// Apply authentication to ALL task routes
// ============================================
// router.use(authenticate) applies the middleware to every route
// defined in this router. This is equivalent to adding 'authenticate'
// to each individual route, but cleaner.
router.use(authenticate);

// ============================================
// GET /api/tasks - Get all tasks for the authenticated user
// ============================================
// Unlike Session 5, we filter by req.userId so users only see
// their own tasks. This is a fundamental security pattern.

router.get('/', async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      // Only return tasks belonging to the authenticated user
      where: {
        userId: req.userId, // This comes from the JWT token!
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/tasks/:id - Get a single task
// ============================================
// We verify the task belongs to the authenticated user.

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID. Must be a number.' });
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    // Check if task exists
    if (!task) {
      return res.status(404).json({ error: `Task with ID ${id} not found.` });
    }

    // SECURITY CHECK: Ensure the task belongs to the authenticated user
    // Without this, any logged-in user could view anyone's tasks by guessing IDs
    if (task.userId !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden. You can only access your own tasks.',
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/tasks - Create a new task
// ============================================
// The task is automatically assigned to the authenticated user.
// No need to send userId in the body - it comes from the JWT token.

router.post('/', validateTask, async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || null,
        status: status || 'pending',
        userId: req.userId, // Assign to the authenticated user
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// ============================================
// PUT /api/tasks/:id - Update a task
// ============================================
// Users can only update their own tasks.

router.put('/:id', validateTask, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID. Must be a number.' });
    }

    // First, verify the task exists and belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: `Task with ID ${id} not found.` });
    }

    if (existingTask.userId !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden. You can only update your own tasks.',
      });
    }

    // Build update data from provided fields
    const { title, description, status } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

// ============================================
// DELETE /api/tasks/:id - Delete a task
// ============================================
// Users can only delete their own tasks.

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID. Must be a number.' });
    }

    // Verify ownership before deleting
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: `Task with ID ${id} not found.` });
    }

    if (existingTask.userId !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden. You can only delete your own tasks.',
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
