// ============================================
// Session 6 Lab: Authentication Middleware
// ============================================
// This middleware protects routes by verifying JWT tokens.
// It sits between the client request and your route handlers,
// acting as a security guard.
//
// HOW IT WORKS:
// 1. Client sends a request with an Authorization header:
//    Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
//
// 2. This middleware extracts the token from the header
// 3. It verifies the token using the JWT_SECRET
// 4. If valid, it attaches the userId to the request (req.userId)
// 5. If invalid or missing, it returns a 401 Unauthorized error
//
// USAGE: Add this middleware to any route that requires authentication:
//   router.get('/protected', authenticate, (req, res) => { ... })
// ============================================

const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 *
 * Verifies the JWT token from the Authorization header.
 * On success: attaches req.userId and calls next()
 * On failure: returns 401 Unauthorized
 */
const authenticate = (req, res, next) => {
  try {
    // ============================================
    // STEP 1: Get the Authorization header
    // ============================================
    // The client sends the token in the Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    // Check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        hint: 'Include an Authorization header with format: Bearer <your_token>',
      });
    }

    // ============================================
    // STEP 2: Extract the token
    // ============================================
    // Split "Bearer eyJhbGciOiJ..." into ["Bearer", "eyJhbGciOiJ..."]
    // and take the second part (index 1)
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Access denied. Token is malformed.',
      });
    }

    // ============================================
    // STEP 3: Verify the token
    // ============================================
    // jwt.verify() does two things:
    //   1. Checks that the token was signed with our JWT_SECRET
    //   2. Checks that the token hasn't expired
    //
    // If either check fails, it throws an error.
    // If both pass, it returns the decoded payload (the data we stored in the token).
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ============================================
    // STEP 4: Attach user info to the request
    // ============================================
    // The decoded payload contains the data we put in when creating the token
    // (see auth.js routes - we store { userId: user.id })
    // We attach it to req so route handlers can access it:
    //   router.get('/tasks', authenticate, (req, res) => {
    //     console.log(req.userId); // The authenticated user's ID
    //   });
    req.userId = decoded.userId;

    // ============================================
    // STEP 5: Continue to the next middleware/route
    // ============================================
    next();
  } catch (error) {
    // ============================================
    // HANDLE TOKEN ERRORS
    // ============================================
    // jwt.verify() throws different errors for different problems:

    if (error.name === 'TokenExpiredError') {
      // The token was valid but has expired
      return res.status(401).json({
        error: 'Token has expired. Please log in again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      // The token is malformed or was signed with a different secret
      return res.status(401).json({
        error: 'Invalid token.',
      });
    }

    // Some other unexpected error
    return res.status(401).json({
      error: 'Authentication failed.',
    });
  }
};

module.exports = authenticate;
