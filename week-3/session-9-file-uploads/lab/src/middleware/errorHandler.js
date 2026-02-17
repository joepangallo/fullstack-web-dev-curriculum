/**
 * =============================================================
 * ERROR HANDLER MIDDLEWARE
 * =============================================================
 *
 * Same as Session 8. Centralized error handling with
 * Prisma-specific error codes.
 * =============================================================
 */

function errorHandler(err, req, res, next) {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const response = { error: err.message || 'Internal server error' };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: `A record with this ${err.meta?.target?.join(', ') || 'value'} already exists.`,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found.' });
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
