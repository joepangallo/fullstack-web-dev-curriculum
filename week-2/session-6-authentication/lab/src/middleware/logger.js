// ============================================
// Session 6 Lab: Request Logger Middleware
// ============================================
// Logs every HTTP request with timestamp, method, URL, status, and duration.
// ============================================

const logger = (req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

module.exports = logger;
