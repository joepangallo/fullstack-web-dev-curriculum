// ============================================
// TaskFlow API: Error Handler Middleware
// ============================================
// Catches all unhandled errors and returns consistent JSON responses.
// Must be registered LAST in the middleware chain.
// ============================================

const errorHandler = (err, req, res, next) => {
  console.error('[TaskFlow Error]', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  // Handle Prisma-specific errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'A record with this value already exists.',
      field: err.meta?.target,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found.',
    });
  }

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
