/**
 * app.js - TaskFlow Express Server
 * ==================================
 * The main server file that wires everything together.
 *
 * Architecture:
 *   This file is the "orchestrator" — it:
 *     1. Loads configuration (environment variables)
 *     2. Creates the Express app
 *     3. Registers middleware (in the correct order!)
 *     4. Mounts route modules
 *     5. Registers error handlers
 *     6. Starts listening for requests
 *
 * Separation of Concerns:
 *   Unlike the lab (where routes were defined directly in app.js), here we
 *   separate routes into their own file (routes/tasks.js). This is a best
 *   practice for larger applications because:
 *     - app.js stays clean and focused on configuration
 *     - Route logic is organized by resource (tasks, users, etc.)
 *     - Easier to test, debug, and maintain
 *
 * Express Router:
 *   Express Router is like a "mini Express app" for a group of related routes.
 *   We define task routes in routes/tasks.js using Router, then "mount" them
 *   here with app.use('/api/tasks', taskRoutes).
 */

// Load .env file variables into process.env
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

// Import middleware
const logger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Import route modules
const taskRoutes = require('./routes/tasks');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// ===== Middleware Stack =====
// Order matters! Each middleware runs in the order it's registered.

// 1. Parse JSON request bodies
app.use(express.json());

// 2. Enable CORS for cross-origin requests (React dev server -> Express)
app.use(cors());

// 3. Log every request
app.use(logger);

// ===== Routes =====

/**
 * Mount the task routes at /api/tasks.
 *
 * app.use('/api/tasks', taskRoutes) means:
 *   - Any request to /api/tasks/* will be handled by taskRoutes
 *   - Inside tasks.js, router.get('/') actually handles GET /api/tasks
 *   - Inside tasks.js, router.get('/:id') handles GET /api/tasks/:id
 *
 * This "mounting" pattern keeps URLs clean and routes organized.
 */
app.use('/api/tasks', taskRoutes);

/**
 * Root route — a simple health check / welcome message.
 * Useful for verifying the server is running.
 */
app.get('/', (req, res) => {
  res.json({
    message: 'TaskFlow API is running!',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks',
    },
  });
});

// ===== Error Handling (AFTER all routes) =====
app.use(notFoundHandler);
app.use(errorHandler);

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`TaskFlow API running on http://localhost:${PORT}`);
  console.log(`Try: GET http://localhost:${PORT}/api/tasks`);
});
