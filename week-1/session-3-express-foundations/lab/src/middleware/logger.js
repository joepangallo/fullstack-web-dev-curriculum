/**
 * logger.js - Request Logging Middleware
 * ----------------------------------------
 * Logs every incoming HTTP request with a timestamp, method, and path.
 *
 * What is Middleware?
 *   Middleware is a function that sits BETWEEN the request and the response.
 *   It receives three parameters:
 *     - req (request)  — information about the incoming HTTP request
 *     - res (response) — methods to send a response back to the client
 *     - next           — a function to call the NEXT middleware in the chain
 *
 *   If you don't call next(), the request gets STUCK and the client never
 *   gets a response (it will eventually time out). Always call next() unless
 *   you're intentionally ending the request (like sending an error response).
 *
 * Middleware Flow:
 *   Request -> Logger -> cors -> express.json -> Route Handler -> Response
 *              ^^^^^
 *              We are here!
 *
 * CommonJS Exports:
 *   In Node.js (backend), we use require/module.exports (CommonJS).
 *   In React (frontend with Vite), we use import/export (ES Modules).
 *   This is because Node.js traditionally uses CommonJS. Modern Node supports
 *   both, but CommonJS is still the standard for Express projects.
 */

/**
 * Logging middleware function.
 * Logs the timestamp, HTTP method, and request path for every request.
 */
const logger = (req, res, next) => {
  // Create a formatted timestamp
  const timestamp = new Date().toISOString();

  // req.method = 'GET', 'POST', 'PUT', 'DELETE', etc.
  // req.path   = '/api/items', '/api/items/1', etc.
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  // IMPORTANT: Call next() to pass control to the next middleware.
  // If we forget this, the request will hang forever!
  next();
};

// Export the middleware function so app.js can import it with require()
module.exports = logger;
