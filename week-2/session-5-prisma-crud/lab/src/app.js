// ============================================
// Session 5 Lab: Express Application Entry Point
// ============================================
// This is the main file that sets up and starts our Express server.
// It connects all the pieces: middleware, routes, and error handling.
//
// The order of middleware registration matters!
// 1. Built-in middleware (JSON parsing, CORS)
// 2. Custom middleware (logger)
// 3. Routes (API endpoints)
// 4. Error handler (must be last)
//
// To start: node src/app.js
// To start with auto-reload: node --watch src/app.js
// ============================================

// ============================================
// LOAD ENVIRONMENT VARIABLES
// ============================================
// dotenv reads the .env file and makes its values available
// as process.env.VARIABLE_NAME. This must be called FIRST,
// before any code tries to access environment variables.
require('dotenv').config();

// ============================================
// IMPORT DEPENDENCIES
// ============================================
const express = require('express');  // Web framework
const cors = require('cors');        // Cross-Origin Resource Sharing

// Import our custom middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import route modules
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

// ============================================
// CREATE EXPRESS APP
// ============================================
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// REGISTER MIDDLEWARE (Order matters!)
// ============================================

// 1. CORS - allows requests from different origins (e.g., React on port 5173)
//    Without CORS, browsers block requests between different ports/domains.
app.use(cors());

// 2. JSON Parser - automatically parses JSON request bodies
//    This lets you access req.body as a JavaScript object
//    when clients send Content-Type: application/json
app.use(express.json());

// 3. Custom Logger - logs every incoming request
app.use(logger);

// ============================================
// HEALTH CHECK ROUTE
// ============================================
// A simple endpoint to verify the server is running.
// Useful for monitoring and load balancers.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Session 5 Lab API is running!',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// MOUNT ROUTE MODULES
// ============================================
// app.use('/prefix', routerModule) mounts a router at a URL prefix.
// All routes defined in taskRoutes will be prefixed with /api/tasks:
//   router.get('/') becomes GET /api/tasks
//   router.get('/:id') becomes GET /api/tasks/:id
//   etc.

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// ============================================
// 404 HANDLER
// ============================================
// If no route matched the request, it falls through to here.
// This middleware catches requests to undefined endpoints.
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist.`,
    availableEndpoints: [
      'GET    /api/health',
      'GET    /api/tasks',
      'GET    /api/tasks/:id',
      'POST   /api/tasks',
      'PUT    /api/tasks/:id',
      'DELETE /api/tasks/:id',
      'GET    /api/users',
      'GET    /api/users/:id',
      'POST   /api/users',
      'PUT    /api/users/:id',
      'DELETE /api/users/:id',
    ],
  });
});

// ============================================
// ERROR HANDLER (Must be LAST!)
// ============================================
// This catches any errors thrown by route handlers or middleware.
// It must be registered after all other middleware and routes.
app.use(errorHandler);

// ============================================
// START THE SERVER
// ============================================
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`  Session 5 Lab API Server`);
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/api/health`);
  console.log('========================================');
});

module.exports = app;
