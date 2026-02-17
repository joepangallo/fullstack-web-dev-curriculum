/**
 * =============================================================
 * ERROR HANDLER MIDDLEWARE - Centralized Error Handling
 * =============================================================
 *
 * Express error handling middleware has 4 parameters: (err, req, res, next).
 * The extra 'err' parameter tells Express this is an error handler.
 *
 * HOW ERRORS REACH HERE:
 *   1. Throwing an error in a route handler
 *   2. Calling next(error) in middleware
 *   3. Async errors caught by try/catch and passed to next()
 *
 * WHY CENTRALIZED ERROR HANDLING?
 *   - Consistent error response format across all routes
 *   - One place to add error logging (Sentry, DataDog, etc.)
 *   - Don't repeat try/catch error formatting in every route
 *   - Security: Don't leak internal errors to clients
 *
 * IMPORTANT: This must be registered AFTER all routes:
 *   app.use('/api/auth', authRoutes);   // Routes first
 *   app.use('/api/tasks', taskRoutes);  // Routes first
 *   app.use(errorHandler);              // Error handler LAST
 * =============================================================
 */

function errorHandler(err, req, res, next) {
  // Log the full error for debugging (server-side only)
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  // Determine the HTTP status code
  // If the error has a statusCode property, use it
  // Otherwise, default to 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  // Build the error response
  const response = {
    error: err.message || 'Internal server error',
  };

  // In development, include the stack trace for debugging
  // NEVER include this in production (security risk)
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Handle specific Prisma errors with user-friendly messages
  if (err.code === 'P2002') {
    // Prisma unique constraint violation
    // e.g., trying to register with an existing email
    return res.status(409).json({
      error: `A record with this ${err.meta?.target?.join(', ') || 'value'} already exists.`,
    });
  }

  if (err.code === 'P2025') {
    // Prisma record not found
    return res.status(404).json({
      error: 'Record not found.',
    });
  }

  // Send the error response
  res.status(statusCode).json(response);
}

module.exports = errorHandler;
