/**
 * =============================================================
 * TASK ROUTES - CRUD with User Scoping
 * =============================================================
 *
 * Same as Session 8. Full CRUD operations for tasks,
 * scoped to the authenticated user.
 * =============================================================
 */

const express = require('express');
const prisma = require('../prisma');

const router = express.Router();

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// GET /api/tasks
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, sort = 'createdAt', order = 'desc' } = req.query;
    const where = { userId: req.user.id };

    if (status && VALID_STATUSES.includes(status)) where.status = status;
    if (priority && VALID_PRIORITIES.includes(priority)) where.priority = priority;

    const validSortFields = ['createdAt', 'updatedAt', 'title', 'status', 'priority'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
    });

    res.json({ tasks, count: tasks.length });
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) return res.status(400).json({ error: 'Invalid task ID.' });

    const task = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });

    if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.json({ task });
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status.` });
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: `Invalid priority.` });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'pending',
        priority: priority || 'medium',
        userId: req.user.id,
      },
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    next(error);
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) return res.status(400).json({ error: 'Invalid task ID.' });

    const { title, description, status, priority } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });
    if (!existingTask) return res.status(404).json({ error: 'Task not found.' });

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'pending',
        priority: priority || 'medium',
      },
    });

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) return res.status(400).json({ error: 'Invalid task ID.' });

    const updateData = {};
    const { title, description, status, priority } = req.body;

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });
    if (!existingTask) return res.status(404).json({ error: 'Task not found.' });

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) return res.status(400).json({ error: 'Invalid task ID.' });

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });
    if (!existingTask) return res.status(404).json({ error: 'Task not found.' });

    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
