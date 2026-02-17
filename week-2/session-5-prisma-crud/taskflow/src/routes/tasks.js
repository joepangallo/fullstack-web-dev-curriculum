// ============================================
// TaskFlow API: Task Routes
// ============================================
// CRUD endpoints for managing TaskFlow project tasks.
//
// Endpoints:
//   GET    /api/tasks      - List all tasks
//   GET    /api/tasks/:id  - Get a specific task
//   POST   /api/tasks      - Create a new task
//   PUT    /api/tasks/:id  - Update a task
//   DELETE /api/tasks/:id  - Delete a task
// ============================================

const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma');
const { validateTask } = require('../middleware/validate');

// ============================================
// GET /api/tasks - List all TaskFlow tasks
// ============================================
router.get('/', async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
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
    const { title, description, status, userId } = req.body;

    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || null,
        status: status || 'pending',
        userId,
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

    const { title, description, status, userId } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (userId !== undefined) updateData.userId = userId;

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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Task with ID ${req.params.id} not found.` });
    }
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

    await prisma.task.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Task with ID ${req.params.id} not found.` });
    }
    next(error);
  }
});

module.exports = router;
