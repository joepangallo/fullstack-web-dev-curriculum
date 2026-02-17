// ============================================
// TaskFlow API: Authentication Routes
// ============================================
// Handles user registration and login for the TaskFlow application.
// Uses bcrypt for secure password hashing and JWT for session tokens.
//
// Endpoints:
//   POST /api/auth/register - Create a new TaskFlow account
//   POST /api/auth/login    - Sign in to TaskFlow
// ============================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../prisma');
const { validateRegister, validateLogin } = require('../middleware/validate');

// ============================================
// POST /api/auth/register - Create a new account
// ============================================
// 1. Validate input data
// 2. Check for existing users with same email/username
// 3. Hash the password with bcrypt
// 4. Create the user record
// 5. Generate and return a JWT token

router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if a user with this email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.trim().toLowerCase() },
          { username: username.trim() },
        ],
      },
    });

    if (existingUser) {
      const conflictField =
        existingUser.email === email.trim().toLowerCase() ? 'email' : 'username';
      return res.status(409).json({
        error: `A user with this ${conflictField} already exists.`,
      });
    }

    // Hash the password (10 salt rounds is the recommended default)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
      },
    });

    // Generate a JWT token for immediate login after registration
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return the token and user info (never include passwordHash!)
    res.status(201).json({
      message: 'Welcome to TaskFlow! Account created successfully.',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/auth/login - Sign in to TaskFlow
// ============================================
// 1. Validate input data
// 2. Find user by email
// 3. Compare password with stored hash
// 4. Generate and return a JWT token

router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Generic error message - don't reveal if email exists or not
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    // Verify password against the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Welcome back to TaskFlow!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
