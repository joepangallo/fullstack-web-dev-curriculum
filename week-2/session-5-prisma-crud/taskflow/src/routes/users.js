// ============================================
// TaskFlow API: User Routes
// ============================================
// CRUD endpoints for managing TaskFlow team members.
//
// Endpoints:
//   GET    /api/users      - List all team members
//   GET    /api/users/:id  - Get a team member's profile with tasks
//   POST   /api/users      - Add a new team member
//   PUT    /api/users/:id  - Update a team member's profile
//   DELETE /api/users/:id  - Remove a team member
// ============================================

const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma');
const { validateUser } = require('../middleware/validate');

// ============================================
// GET /api/users - List all team members
// ============================================
router.get('/', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// ============================================
// GET /api/users/:id - Get a team member's profile
// ============================================
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: `User with ID ${id} not found.` });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/users - Add a new team member
// ============================================
router.post('/', validateUser, async (req, res, next) => {
  try {
    const { username, email, passwordHash, avatarUrl } = req.body;

    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        avatarUrl: avatarUrl || null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return res.status(409).json({
        error: `A user with this ${field} already exists.`,
      });
    }
    next(error);
  }
});

// ============================================
// PUT /api/users/:id - Update a team member
// ============================================
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    const { username, email, avatarUrl } = req.body;

    const updateData = {};
    if (username !== undefined) updateData.username = username.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'At least one field (username, email, avatarUrl) must be provided.',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `User with ID ${req.params.id} not found.` });
    }
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return res.status(409).json({
        error: `A user with this ${field} already exists.`,
      });
    }
    next(error);
  }
});

// ============================================
// DELETE /api/users/:id - Remove a team member
// ============================================
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `User with ID ${req.params.id} not found.` });
    }
    next(error);
  }
});

module.exports = router;
