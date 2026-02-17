const express = require('express');
const prisma = require('../prisma');
const router = express.Router();

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

router.get('/', async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const where = { userId: req.user.id };
    if (status && VALID_STATUSES.includes(status)) where.status = status;
    if (priority && VALID_PRIORITIES.includes(priority)) where.priority = priority;
    const tasks = await prisma.task.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ tasks, count: tasks.length });
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title required.' });
    const task = await prisma.task.create({
      data: { title: title.trim(), description: description?.trim() || null, status: status || 'pending', priority: priority || 'medium', userId: req.user.id },
    });
    res.status(201).json({ message: 'Task created', task });
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const { title, description, status, priority } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title required.' });
    const existing = await prisma.task.findFirst({ where: { id: taskId, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Task not found.' });
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { title: title.trim(), description: description?.trim() || null, status: status || 'pending', priority: priority || 'medium' },
    });
    res.json({ message: 'Task updated', task });
  } catch (error) { next(error); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const existing = await prisma.task.findFirst({ where: { id: taskId, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Task not found.' });
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title.trim();
    if (req.body.description !== undefined) updateData.description = req.body.description?.trim() || null;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.priority !== undefined) updateData.priority = req.body.priority;
    const task = await prisma.task.update({ where: { id: taskId }, data: updateData });
    res.json({ message: 'Task updated', task });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const existing = await prisma.task.findFirst({ where: { id: taskId, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Task not found.' });
    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: 'Task deleted' });
  } catch (error) { next(error); }
});

module.exports = router;
