// ============================================
// TaskFlow API: User Routes (Authenticated)
// ============================================
// Authenticated profile routes for TaskFlow team members.
// Users can view and update their own profile.
//
// Endpoints:
//   GET    /api/users/profile - Get my TaskFlow profile
//   PUT    /api/users/profile - Update my TaskFlow profile
// ============================================

const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma');
const authenticate = require('../middleware/auth');

// Require authentication for all user routes
router.use(authenticate);

// ============================================
// GET /api/users/profile - Get my profile
// ============================================
// Returns the authenticated user's profile with task summary.

router.get('/profile', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { tasks: true },
        },
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
          take: 5, // Show 5 most recent tasks
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// ============================================
// PUT /api/users/profile - Update my profile
// ============================================
// Allows updating username, email, and avatar URL.

router.put('/profile', async (req, res, next) => {
  try {
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

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        error: 'Email must be a valid email address.',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    res.json({
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
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

module.exports = router;
