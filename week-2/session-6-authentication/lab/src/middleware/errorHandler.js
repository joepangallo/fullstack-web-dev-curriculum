// ============================================
// Session 6 Lab: Error Handler Middleware
// ============================================
// Global error handler that catches all unhandled errors.
// Handles Prisma-specific errors and JWT errors gracefully.
// Must be registered LAST in the middleware chain.
// ============================================

const errorHandler = (err, req, res, next) => {
  console.error('--- Error Handler ---');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);

  const statusCode = err.statusCode || 500;

  // Handle Prisma unique constraint violations
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'A record with this value already exists.',
      field: err.meta?.target,
    });
  }

  // Handle Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found.',
    });
  }

  // Handle JWT-specific errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token has expired. Please log in again.',
    });
  }

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
