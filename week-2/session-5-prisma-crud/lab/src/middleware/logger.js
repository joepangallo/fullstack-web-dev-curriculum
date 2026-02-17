// ============================================
// Session 5 Lab: Request Logger Middleware
// ============================================
// This middleware logs every incoming HTTP request to the console.
// It helps you see what's happening when the API receives requests.
//
// Middleware functions have access to:
//   req  - the request object (what the client sent)
//   res  - the response object (what we'll send back)
//   next - a function to pass control to the next middleware
//
// You MUST call next() or the request will hang forever!
// ============================================

/**
 * Logs HTTP method, URL, and response time for every request.
 * Example output: [2024-01-15T10:30:00Z] GET /api/tasks - 45ms
 */
const logger = (req, res, next) => {
  // Record when the request started
  const startTime = Date.now();

  // Get the current timestamp in ISO format
  const timestamp = new Date().toISOString();

  // Listen for when the response finishes being sent
  // The 'finish' event fires after the response is complete
  res.on('finish', () => {
    // Calculate how long the request took to process
    const duration = Date.now() - startTime;

    // Log the request details
    // res.statusCode is the HTTP status (200, 404, 500, etc.)
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  // Pass control to the next middleware or route handler
  // Without this call, the request would never reach your routes!
  next();
};

module.exports = logger;
