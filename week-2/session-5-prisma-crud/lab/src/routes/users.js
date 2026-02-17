// ============================================
// Session 5 Lab: User Routes (CRUD Operations)
// ============================================
// API endpoints for managing users.
// Similar to tasks, but demonstrates different Prisma query patterns.
//
// Route summary:
//   GET    /api/users      - Get all users (without passwords!)
//   GET    /api/users/:id  - Get one user with their tasks
//   POST   /api/users      - Create a new user
//   PUT    /api/users/:id  - Update user profile
//   DELETE /api/users/:id  - Delete a user (cascades to their tasks)
// ============================================

const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma');
const { validateUser } = require('../middleware/validate');

// ============================================
// GET /api/users - Retrieve all users
// ============================================
// Returns all users WITHOUT their password hashes.
// Never send password data to the client!
// We also include a count of each user's tasks using _count.

router.get('/', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      // 'select' lets you choose exactly which fields to return
      // This is different from 'include' - select is more restrictive
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        // _count gives us the count of related records
        // without loading all the actual task data
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
// GET /api/users/:id - Retrieve a single user
// ============================================
// Returns one user with all their tasks included.
// Great for a "user profile" page.

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID. Must be a number.' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        // Include all of this user's tasks
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
// POST /api/users - Create a new user
// ============================================
// Creates a new user account.
// NOTE: In a real app, you would hash the password here.
// We'll add proper authentication in Session 6.

router.post('/', validateUser, async (req, res, next) => {
  try {
    const { username, email, passwordHash, avatarUrl } = req.body;

    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(), // Normalize email
        passwordHash,
        avatarUrl: avatarUrl || null,
      },
      // Return the new user WITHOUT the password hash
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
    // Prisma P2002 = unique constraint violation
    // This happens if the username or email already exists
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
// PUT /api/users/:id - Update a user
// ============================================
// Updates user profile information.
// Only updates fields that are provided in the request body.

router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID. Must be a number.' });
    }

    const { username, email, avatarUrl } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (username !== undefined) updateData.username = username.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    // Must provide at least one field to update
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
// DELETE /api/users/:id - Delete a user
// ============================================
// Permanently removes a user and all their tasks (CASCADE).
// This is a destructive action - in a real app, you might
// "soft delete" by setting an isActive flag to false instead.

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID. Must be a number.' });
    }

    await prisma.user.delete({
      where: { id },
    });

    // 204 No Content - deleted successfully
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `User with ID ${req.params.id} not found.` });
    }
    next(error);
  }
});

module.exports = router;
