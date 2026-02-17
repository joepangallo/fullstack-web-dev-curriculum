/**
 * =============================================================
 * LOGGER MIDDLEWARE
 * =============================================================
 *
 * Same as Session 8. Logs HTTP requests with timing info.
 * =============================================================
 */

function loggerMiddleware(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const status = res.statusCode;

    let statusColor;
    if (status >= 500) statusColor = '\x1b[31m';
    else if (status >= 400) statusColor = '\x1b[33m';
    else if (status >= 300) statusColor = '\x1b[36m';
    else statusColor = '\x1b[32m';
    const reset = '\x1b[0m';

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ${statusColor}${status}${reset} (${duration}ms)`
    );
  });

  next();
}

module.exports = loggerMiddleware;
