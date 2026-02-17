// ============================================
// TaskFlow API: Application Entry Point
// ============================================
// Main server file for the TaskFlow project management API.
// Sets up Express with middleware, routes, and error handling.
//
// To start: npm start
// To start with auto-reload: npm run dev
// ============================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Routes
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE STACK
// ============================================
app.use(cors());           // Allow cross-origin requests
app.use(express.json());   // Parse JSON request bodies
app.use(logger);           // Log all requests

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'TaskFlow API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `${req.method} ${req.originalUrl} does not exist.`,
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
// ERROR HANDLER (must be last)
// ============================================
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log('========================================');
  console.log('  TaskFlow API Server');
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log('========================================');
});

module.exports = app;
