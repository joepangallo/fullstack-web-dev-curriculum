/**
 * =============================================================
 * AUTH ROUTES - User Registration and Login
 * =============================================================
 *
 * POST /api/auth/register - Create a new user account
 * POST /api/auth/login    - Authenticate and get a JWT token
 *
 * KEY CONCEPTS:
 *   - Password hashing with bcrypt (never store plain text passwords!)
 *   - JWT token generation for stateless authentication
 *   - Input validation before database operations
 *   - Prisma for database queries
 *
 * AUTHENTICATION FLOW:
 *   Register: email + password -> hash password -> save user -> generate JWT
 *   Login:    email + password -> find user -> compare hash -> generate JWT
 *
 * The JWT contains the user's id, username, and email.
 * The frontend stores this token and sends it with every request.
 * =============================================================
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

const router = express.Router();

// Number of salt rounds for bcrypt
// Higher = more secure but slower. 10-12 is recommended.
const SALT_ROUNDS = 10;

/**
 * Generate a JWT token for a user.
 *
 * The token contains the user's id, username, and email.
 * These are called "claims" - pieces of information encoded in the token.
 *
 * @param {object} user - User object from database
 * @returns {string} - Signed JWT token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
}

/**
 * POST /api/auth/register
 *
 * Creates a new user account.
 *
 * Request body: { username, email, password }
 * Response: { message, token, user: { id, username, email } }
 *
 * SECURITY STEPS:
 *   1. Validate input (required fields, email format, password length)
 *   2. Check if email/username already exists
 *   3. Hash the password with bcrypt
 *   4. Save the user to the database
 *   5. Generate and return a JWT token
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // --- Input Validation ---

    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Username, email, and password are required.',
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        error: 'Username must be at least 3 characters.',
      });
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Please provide a valid email address.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters.',
      });
    }

    // --- Check for existing user ---

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username },
        ],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
      return res.status(409).json({
        error: `A user with this ${field} already exists.`,
      });
    }

    // --- Hash password ---
    // bcrypt.hash(plaintext, saltRounds) generates a random salt
    // and hashes the password. The salt is embedded in the hash.
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // --- Create user in database ---
    const user = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(), // Store emails in lowercase
        password: hashedPassword,     // Store the HASH, never plain text
      },
      select: {
        // Only select fields we want to return (exclude password!)
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    // --- Generate JWT token ---
    const token = generateToken(user);

    // --- Send response ---
    res.status(201).json({
      message: 'Registration successful',
      token,
      user,
    });
  } catch (error) {
    // Pass errors to the centralized error handler
    next(error);
  }
});

/**
 * POST /api/auth/login
 *
 * Authenticates a user with email and password.
 *
 * Request body: { email, password }
 * Response: { message, token, user: { id, username, email } }
 *
 * SECURITY:
 *   - Use the same error message for "email not found" and
 *     "wrong password" to prevent email enumeration attacks.
 *   - bcrypt.compare() is timing-safe (prevents timing attacks).
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // --- Input validation ---
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.',
      });
    }

    // --- Find user by email ---
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // User not found - use a generic error message
    // DON'T say "email not found" (would reveal which emails are registered)
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    // --- Compare password with stored hash ---
    // bcrypt.compare() hashes the provided password with the same salt
    // from the stored hash and checks if they match
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Same generic error message for wrong password
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    // --- Generate JWT token ---
    const token = generateToken(user);

    // --- Send response (exclude password!) ---
    res.json({
      message: 'Login successful',
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
