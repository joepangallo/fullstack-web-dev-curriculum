// ============================================
// TaskFlow API: Authentication Middleware
// ============================================
// Protects routes by verifying JWT tokens from the Authorization header.
//
// Usage: router.use(authenticate) or router.get('/path', authenticate, handler)
//
// On success: sets req.userId from the decoded token and calls next()
// On failure: returns 401 Unauthorized
// ============================================

const jwt = require('jsonwebtoken');

/**
 * JWT authentication middleware for TaskFlow.
 * Extracts and verifies the Bearer token from the Authorization header.
 */
const authenticate = (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check header exists and has the Bearer format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        hint: 'Include an Authorization header: Bearer <your_token>',
      });
    }

    // Extract the token (everything after "Bearer ")
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Access denied. Token is malformed.',
      });
    }

    // Verify the token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID from the token payload to the request object
    // This makes it available in all subsequent route handlers
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired. Please log in again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token.',
      });
    }

    return res.status(401).json({
      error: 'Authentication failed.',
    });
  }
};

module.exports = authenticate;
