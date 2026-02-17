/**
 * errorHandler.js - Error Handling Middleware
 * ---------------------------------------------
 * Two middleware functions for handling different error scenarios:
 *
 * 1. notFoundHandler — Catches requests to routes that don't exist (404)
 * 2. errorHandler    — Catches all unhandled errors in the application (500)
 *
 * Key Concepts:
 *   404 Not Found:
 *     If a request doesn't match ANY route, it "falls through" to this handler.
 *     This is different from "item not found" (which is handled in the route itself).
 *     Example: GET /api/bananas — there's no route for this, so 404.
 *
 *   Global Error Handler:
 *     Express recognizes a middleware as an error handler when it has
 *     EXACTLY 4 parameters: (err, req, res, next).
 *     If any route handler throws an error or calls next(err),
 *     Express skips normal middleware and jumps straight to error handlers.
 *
 *   Why Both?
 *     - 404 handler = "We received your request but don't know what you want"
 *     - Error handler = "Something went wrong while processing your request"
 */

/**
 * 404 Not Found Handler.
 * This catches any request that didn't match a defined route.
 * It must be placed AFTER all route definitions.
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The route ${req.method} ${req.originalUrl} does not exist`,
  });
};

/**
 * Global Error Handler.
 * Catches any errors thrown in route handlers or middleware.
 *
 * IMPORTANT: This MUST have exactly 4 parameters (err, req, res, next).
 * Even if you don't use `next`, it must be there for Express to recognize
 * this as an error handler. Removing it would make Express treat it as
 * regular middleware and it wouldn't receive errors.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging (in production, use a proper logging service)
  console.error('Server Error:', err.message);
  console.error(err.stack);

  // Send a generic error response
  // In production, NEVER expose err.stack to the client (security risk)
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'       // Vague message in production
      : err.message,                  // Detailed message in development
  });
};

// Export both functions as named exports
module.exports = { notFoundHandler, errorHandler };
