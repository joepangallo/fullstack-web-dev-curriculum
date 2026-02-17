// ============================================
// Session 6 Lab: User Routes (Authenticated)
// ============================================
// User profile routes that require authentication.
// Users can view and update their own profile.
//
// KEY CHANGES FROM SESSION 5:
// 1. Routes use the authenticate middleware
// 2. Users can only access/modify their own profile via req.userId
// 3. No more public user listing (security improvement)
//
// Route summary:
//   GET    /api/users/profile - Get my profile
//   PUT    /api/users/profile - Update my profile
// ============================================

const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma');
const authenticate = require('../middleware/auth');

// ============================================
// Apply authentication to ALL user routes
// ============================================
router.use(authenticate);

// ============================================
// GET /api/users/profile - Get my profile
// ============================================
// Returns the authenticated user's profile with their tasks.
// The user ID comes from the JWT token, not the URL.
// This means a user can ONLY access their own profile.

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
        // Include task count and recent tasks
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
          take: 5, // Only return the 5 most recent tasks
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
// Users can update their own username, email, and avatar.
// They cannot change their password here (that would be a
// separate /api/auth/change-password route in a full app).

router.put('/profile', async (req, res, next) => {
  try {
    const { username, email, avatarUrl } = req.body;

    // Build update object with only provided fields
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
      where: { id: req.userId }, // Only update MY profile
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
