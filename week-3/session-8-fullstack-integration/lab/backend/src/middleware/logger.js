/**
 * =============================================================
 * LOGGER MIDDLEWARE - Request Logging
 * =============================================================
 *
 * Logs every incoming HTTP request for debugging and monitoring.
 *
 * OUTPUT FORMAT:
 *   [2024-01-15T10:30:45.123Z] GET /api/tasks - 200 (45ms)
 *
 * This is a simple custom logger. In production, you would use
 * a library like 'morgan' (HTTP logging) or 'winston' (general
 * purpose logging with levels, transports, etc.).
 *
 * MIDDLEWARE FLOW:
 *   1. Record the start time
 *   2. Call next() to let the route handler process the request
 *   3. After the response is sent (on 'finish' event), log the result
 *
 * The 'finish' event fires when the response is fully sent to
 * the client, giving us the final status code and timing.
 * =============================================================
 */

function loggerMiddleware(req, res, next) {
  // Record when the request started
  const startTime = Date.now();

  // Listen for the 'finish' event on the response
  // This fires after res.send(), res.json(), etc. complete
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    // Color the status code for terminal readability
    const status = res.statusCode;
    let statusColor;
    if (status >= 500) statusColor = '\x1b[31m';      // Red for 5xx (server error)
    else if (status >= 400) statusColor = '\x1b[33m';  // Yellow for 4xx (client error)
    else if (status >= 300) statusColor = '\x1b[36m';  // Cyan for 3xx (redirect)
    else statusColor = '\x1b[32m';                      // Green for 2xx (success)
    const reset = '\x1b[0m';

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ${statusColor}${status}${reset} (${duration}ms)`
    );
  });

  // Continue to the next middleware/route handler
  next();
}

module.exports = loggerMiddleware;
