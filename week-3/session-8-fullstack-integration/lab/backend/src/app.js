/**
 * =============================================================
 * EXPRESS APPLICATION - Main Server Entry Point
 * =============================================================
 *
 * This file assembles the entire Express application:
 *   1. Load environment variables
 *   2. Create the Express app
 *   3. Register global middleware (CORS, JSON parsing, logging)
 *   4. Mount route handlers
 *   5. Register error handling middleware
 *   6. Start the server
 *
 * MIDDLEWARE ORDER MATTERS:
 *   The order middleware is registered determines the order it runs.
 *
 *   Request flow:
 *     CORS -> JSON Parser -> Logger -> Route Handler -> Error Handler
 *
 *   - CORS must come first (handles preflight OPTIONS requests)
 *   - JSON parser must come before routes (routes need parsed body)
 *   - Logger should be early (logs all requests)
 *   - Error handler must be LAST (catches errors from everything above)
 *
 * ARCHITECTURE:
 *   Routes are split into separate files (auth.js, tasks.js)
 *   and mounted at specific paths. This keeps the main app.js
 *   clean and makes it easy to add new route groups.
 * =============================================================
 */

// Load environment variables from .env file FIRST
// This must happen before any code that reads process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import middleware
const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

// Import route handlers
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Create the Express application
const app = express();
const PORT = process.env.PORT || 3001;

// =============================================================
// GLOBAL MIDDLEWARE
// These run for EVERY request, in the order they're registered
// =============================================================

/**
 * CORS (Cross-Origin Resource Sharing)
 *
 * By default, browsers block requests from one origin to another.
 * CORS headers tell the browser which origins are allowed.
 *
 * In development, the React dev server (port 5173) needs to
 * make requests to this Express server (port 3001).
 * The Vite proxy handles this, but we add CORS as a safety net.
 */
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true, // Allow cookies and auth headers
}));

/**
 * JSON Body Parser
 *
 * Parses incoming request bodies with JSON content type.
 * After this middleware, req.body contains the parsed object.
 * The limit option prevents extremely large payloads.
 */
app.use(express.json({ limit: '10mb' }));

/**
 * URL-Encoded Body Parser
 *
 * Parses form data (content-type: application/x-www-form-urlencoded).
 * Extended: true allows nested objects in form data.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Request Logger
 *
 * Our custom middleware that logs every request with timing info.
 */
app.use(loggerMiddleware);

// =============================================================
// ROUTES
// =============================================================

/**
 * Health Check Endpoint
 *
 * A simple endpoint to verify the server is running.
 * Useful for load balancers, monitoring, and deployment checks.
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Auth Routes (public - no auth middleware)
 *
 * POST /api/auth/register
 * POST /api/auth/login
 */
app.use('/api/auth', authRoutes);

/**
 * Task Routes (protected - requires authentication)
 *
 * The authMiddleware runs before any task route handler.
 * It verifies the JWT token and sets req.user.
 *
 * GET    /api/tasks
 * GET    /api/tasks/:id
 * POST   /api/tasks
 * PUT    /api/tasks/:id
 * PATCH  /api/tasks/:id
 * DELETE /api/tasks/:id
 */
app.use('/api/tasks', authMiddleware, taskRoutes);

// =============================================================
// ERROR HANDLING
// Must be registered AFTER all routes
// =============================================================

/**
 * 404 Handler
 *
 * If no route matched the request, this middleware creates
 * a 404 error and passes it to the error handler.
 */
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

/**
 * Global Error Handler
 *
 * Catches all errors from route handlers and middleware.
 * Returns a consistent error response format.
 */
app.use(errorHandler);

// =============================================================
// START SERVER
// =============================================================

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  Server running on http://localhost:${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================\n`);
  console.log(`  API Endpoints:`);
  console.log(`  POST   /api/auth/register`);
  console.log(`  POST   /api/auth/login`);
  console.log(`  GET    /api/tasks`);
  console.log(`  POST   /api/tasks`);
  console.log(`  PUT    /api/tasks/:id`);
  console.log(`  PATCH  /api/tasks/:id`);
  console.log(`  DELETE /api/tasks/:id`);
  console.log(`  GET    /api/health\n`);
});

module.exports = app;
