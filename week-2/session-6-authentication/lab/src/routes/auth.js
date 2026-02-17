// ============================================
// Session 6 Lab: Authentication Routes
// ============================================
// These routes handle user registration and login.
// They use bcrypt for password hashing and JWT for session tokens.
//
// SECURITY CONCEPTS:
//
// 1. PASSWORD HASHING (bcrypt):
//    - We NEVER store plain-text passwords in the database
//    - bcrypt.hash() converts "mypassword" into a random-looking string
//    - The same password always produces DIFFERENT hashes (due to salt)
//    - bcrypt.compare() checks if a password matches a hash
//    - Even if the database is stolen, passwords can't be recovered
//
// 2. JWT (JSON Web Tokens):
//    - After login, we give the client a signed token
//    - The token contains the user's ID (payload)
//    - The token is signed with our secret key
//    - The client sends this token with every request
//    - We verify the token to identify who's making the request
//    - Tokens expire after a set time (JWT_EXPIRES_IN)
//
// Route summary:
//   POST /api/auth/register - Create a new account
//   POST /api/auth/login    - Log in to an existing account
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
// Flow:
// 1. Validate input (username, email, password)
// 2. Check if email/username already exists
// 3. Hash the password with bcrypt
// 4. Create the user in the database
// 5. Generate a JWT token
// 6. Return the token and user info

router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // ============================================
    // Check if user already exists
    // ============================================
    // We check both email and username since both must be unique.
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.trim().toLowerCase() },
          { username: username.trim() },
        ],
      },
    });

    if (existingUser) {
      // Determine which field caused the conflict
      const conflictField =
        existingUser.email === email.trim().toLowerCase() ? 'email' : 'username';
      return res.status(409).json({
        error: `A user with this ${conflictField} already exists.`,
      });
    }

    // ============================================
    // Hash the password
    // ============================================
    // bcrypt.hash(password, saltRounds)
    //   - password: the plain-text password from the user
    //   - saltRounds: how many times to process the hash (10 is standard)
    //     Higher = more secure but slower. 10 is a good balance.
    //
    // The resulting hash looks like:
    //   $2b$10$xJ8Kq3LmN9vR2wF5tY7uZeQpA1sD4gH6jK8lM0nO3pR5tU7vX9yB
    //   |  |  |  |
    //   |  |  |  └── The hash itself
    //   |  |  └───── The salt (random data mixed in)
    //   |  └──────── The cost factor (10 rounds)
    //   └─────────── The algorithm identifier (2b = bcrypt)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // ============================================
    // Create the user in the database
    // ============================================
    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        passwordHash, // Store the HASH, never the plain password!
      },
    });

    // ============================================
    // Generate a JWT token
    // ============================================
    // jwt.sign(payload, secret, options)
    //   - payload: data to store in the token (keep it minimal!)
    //   - secret: the key used to sign the token (from .env)
    //   - expiresIn: when the token expires (from .env)
    //
    // The token contains: { userId: 1, iat: 1234567890, exp: 1234654290 }
    //   iat = "issued at" (when the token was created)
    //   exp = "expires" (when the token becomes invalid)
    const token = jwt.sign(
      { userId: newUser.id }, // Payload: just the user ID
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // ============================================
    // Return success response
    // ============================================
    // We return the token and basic user info (NO password hash!)
    res.status(201).json({
      message: 'User registered successfully!',
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
// POST /api/auth/login - Log in to an account
// ============================================
// Flow:
// 1. Validate input (email, password)
// 2. Find the user by email
// 3. Compare the password with the stored hash
// 4. Generate a JWT token
// 5. Return the token and user info

router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ============================================
    // Find the user by email
    // ============================================
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // If no user found, return a generic error
    // SECURITY: Don't reveal whether the email or password was wrong!
    // Saying "email not found" tells attackers which emails are registered.
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    // ============================================
    // Verify the password
    // ============================================
    // bcrypt.compare(plainPassword, hashedPassword)
    // Returns true if the password matches the hash, false otherwise.
    // This is the magic of bcrypt - it can check a password against
    // a hash without ever "decrypting" the hash.
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    // ============================================
    // Generate JWT token
    // ============================================
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // ============================================
    // Return success response
    // ============================================
    res.json({
      message: 'Login successful!',
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
