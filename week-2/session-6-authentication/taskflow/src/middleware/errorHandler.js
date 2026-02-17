// ============================================
// TaskFlow API: Error Handler Middleware
// ============================================
// Catches all unhandled errors and returns consistent JSON responses.
// Handles Prisma errors, JWT errors, and general exceptions.
// Must be registered LAST in the middleware chain.
// ============================================

const errorHandler = (err, req, res, next) => {
  console.error('[TaskFlow Error]', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  // Prisma: unique constraint violation
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'A record with this value already exists.',
      field: err.meta?.target,
    });
  }

  // Prisma: record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found.',
    });
  }

  // JWT: invalid token
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token.',
    });
  }

  // JWT: expired token
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
