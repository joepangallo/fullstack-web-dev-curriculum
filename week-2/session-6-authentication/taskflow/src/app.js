// ============================================
// TaskFlow API: Application Entry Point (with Auth)
// ============================================
// Main server for the TaskFlow project management API.
// Auth routes (register/login) are public.
// Task and user routes require JWT authentication.
//
// To test the auth flow:
// 1. Register: POST /api/auth/register { username, email, password }
// 2. Copy the token from the response
// 3. Add header: Authorization: Bearer <token>
// 4. Access protected routes: GET /api/tasks, GET /api/users/profile
// ============================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(logger);

// ============================================
// HEALTH CHECK (public)
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'TaskFlow API',
    version: '2.0.0',
    auth: 'JWT',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// PUBLIC ROUTES (no auth required)
// ============================================
app.use('/api/auth', authRoutes);

// ============================================
// PROTECTED ROUTES (auth required)
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
    availableEndpoints: {
      public: [
        'GET    /api/health',
        'POST   /api/auth/register',
        'POST   /api/auth/login',
      ],
      protected: [
        'GET    /api/tasks',
        'GET    /api/tasks/:id',
        'POST   /api/tasks',
        'PUT    /api/tasks/:id',
        'DELETE /api/tasks/:id',
        'GET    /api/users/profile',
        'PUT    /api/users/profile',
      ],
    },
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
  console.log('  TaskFlow API (with Authentication)');
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('  Public:');
  console.log(`    POST /api/auth/register`);
  console.log(`    POST /api/auth/login`);
  console.log('');
  console.log('  Protected (Bearer token required):');
  console.log(`    GET  /api/tasks`);
  console.log(`    GET  /api/users/profile`);
  console.log('========================================');
});

module.exports = app;
