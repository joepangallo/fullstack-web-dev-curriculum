// ============================================
// TaskFlow API: Task Routes (Authenticated)
// ============================================
// All task endpoints require authentication.
// Tasks are scoped to the authenticated user - you can only
// see, create, update, and delete your own tasks.
//
// Endpoints:
//   GET    /api/tasks      - List my tasks
//   GET    /api/tasks/:id  - Get one of my tasks
//   POST   /api/tasks      - Create a task (assigned to me)
//   PUT    /api/tasks/:id  - Update one of my tasks
//   DELETE /api/tasks/:id  - Delete one of my tasks
// ============================================

const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma');
const authenticate = require('../middleware/auth');
const { validateTask } = require('../middleware/validate');

// Require authentication for all task routes
router.use(authenticate);

// ============================================
// GET /api/tasks - List my tasks
// ============================================
router.get('/', async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.userId, // Only my tasks
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
// GET /api/tasks/:id - Get a specific task
// ============================================
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
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

    if (!task) {
      return res.status(404).json({ error: `Task with ID ${id} not found.` });
    }

    // Verify ownership
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
router.post('/', validateTask, async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || null,
        status: status || 'pending',
        userId: req.userId, // Assign to authenticated user
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
router.put('/:id', validateTask, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
    }

    // Verify task exists and belongs to the user
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
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
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
