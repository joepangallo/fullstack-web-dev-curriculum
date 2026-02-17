/**
 * logger.js - Request Logging Middleware
 * ----------------------------------------
 * Logs each request with timestamp, method, path, and response time.
 *
 * This version is slightly more advanced than the lab version:
 * it also measures how long the request took to process (response time).
 *
 * Key Concept:
 *   res.on('finish', ...) — The response object is an EventEmitter.
 *   The 'finish' event fires when the response has been sent to the client.
 *   This lets us calculate the total time from request start to response end.
 */

const logger = (req, res, next) => {
  // Record when the request started
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // When the response is sent, log the complete request info
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
    );
  });

  // Pass control to the next middleware
  next();
};

module.exports = logger;
