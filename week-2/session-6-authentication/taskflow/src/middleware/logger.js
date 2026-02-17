// ============================================
// TaskFlow API: Request Logger Middleware
// ============================================
// Logs every HTTP request with method, URL, status, and duration.
// ============================================

const logger = (req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(
      `[TaskFlow] [${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

module.exports = logger;
