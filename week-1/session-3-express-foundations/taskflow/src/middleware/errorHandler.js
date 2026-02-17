/**
 * errorHandler.js - Error Handling Middleware
 * ---------------------------------------------
 * Handles 404 (Not Found) and 500 (Server Error) responses.
 *
 * Same pattern as the lab, but with slightly more informative messages.
 * In a production app, you'd also log errors to a service like Sentry.
 */

/**
 * 404 Not Found Handler.
 * Catches requests that don't match any defined route.
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist. Check the API documentation.`,
  });
};

/**
 * Global Error Handler.
 * Must have exactly 4 parameters for Express to recognize it as an error handler.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err.message);
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
  });
};

module.exports = { notFoundHandler, errorHandler };
