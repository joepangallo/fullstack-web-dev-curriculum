// ============================================
// Session 5 Lab: Error Handler Middleware
// ============================================
// This is a special type of middleware called an "error handler."
// It has FOUR parameters instead of three: (err, req, res, next).
// Express knows it's an error handler because of the 4 parameters.
//
// When any route or middleware calls next(error) or throws an error,
// Express skips all remaining middleware and jumps to this handler.
//
// This must be the LAST middleware registered in your app
// (after all routes) so it catches errors from everywhere.
// ============================================

/**
 * Global error handler - catches all unhandled errors in the app.
 * Sends a consistent JSON error response to the client.
 *
 * @param {Error} err - The error that was thrown or passed to next()
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function (required for Express to recognize this as error handler)
 */
const errorHandler = (err, req, res, next) => {
  // Log the full error for debugging (only visible on the server)
  console.error('--- Error Handler ---');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);

  // ============================================
  // Determine the appropriate status code
  // ============================================
  // If the error has a statusCode property, use it.
  // Otherwise, default to 500 (Internal Server Error).
  const statusCode = err.statusCode || 500;

  // ============================================
  // Handle specific Prisma errors
  // ============================================
  // Prisma throws specific error codes we can handle gracefully.
  // P2002 = unique constraint violation (e.g., duplicate email)
  // P2025 = record not found
  // See: https://www.prisma.io/docs/reference/api-reference/error-reference

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'A record with this value already exists.',
      field: err.meta?.target, // Which field caused the conflict
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found.',
    });
  }

  // ============================================
  // Send error response to client
  // ============================================
  // In production, you'd hide the stack trace from clients.
  // Here we include it for learning purposes.

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    // Only include stack trace in development (not production)
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
