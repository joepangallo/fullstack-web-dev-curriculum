/**
 * =============================================================
 * AUTH MIDDLEWARE - JWT Token Verification
 * =============================================================
 *
 * This middleware protects API routes by verifying the JWT token
 * in the Authorization header.
 *
 * HOW IT WORKS:
 *   1. Read the Authorization header from the request
 *   2. Extract the token (after "Bearer ")
 *   3. Verify the token using the JWT_SECRET
 *   4. Attach the decoded user data to req.user
 *   5. Call next() to continue to the route handler
 *
 * If any step fails, return 401 Unauthorized.
 *
 * MIDDLEWARE PATTERN:
 *   Express middleware receives (req, res, next).
 *   It can modify req/res, end the request, or call next()
 *   to pass control to the next middleware/route handler.
 *
 * USAGE:
 *   // Protect a single route:
 *   router.get('/profile', authMiddleware, (req, res) => { ... });
 *
 *   // Protect all routes in a router:
 *   router.use(authMiddleware);
 * =============================================================
 */

const jwt = require('jsonwebtoken');

/**
 * Authentication middleware function.
 *
 * Verifies the JWT token and attaches user data to the request.
 * Protected routes can then access req.user.id, req.user.email, etc.
 */
function authMiddleware(req, res, next) {
  try {
    // Step 1: Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
      });
    }

    // Step 2: Extract the token (everything after "Bearer ")
    // "Bearer eyJhbGciOi..." -> "eyJhbGciOi..."
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Access denied. Token is empty.',
      });
    }

    // Step 3: Verify the token
    // jwt.verify() checks:
    //   - The signature matches (token wasn't tampered with)
    //   - The token hasn't expired (if exp claim exists)
    // If valid, it returns the decoded payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Attach user data to the request object
    // Now any route handler can access req.user
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };

    // Step 5: Continue to the next middleware or route handler
    next();
  } catch (error) {
    // jwt.verify() throws different errors for different problems:
    //   - TokenExpiredError: Token has expired
    //   - JsonWebTokenError: Token is malformed or signature is invalid
    //   - NotBeforeError: Token is not yet active

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired. Please log in again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token. Please log in again.',
      });
    }

    // Unexpected error
    return res.status(401).json({
      error: 'Authentication failed.',
    });
  }
}

module.exports = authMiddleware;
