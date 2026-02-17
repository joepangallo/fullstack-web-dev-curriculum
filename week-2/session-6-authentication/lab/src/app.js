// ============================================
// Session 6 Lab: Express App with Authentication
// ============================================
// This builds on Session 5's app by adding JWT authentication.
// The key change: auth routes are PUBLIC, but task and user routes
// are PROTECTED (require a valid JWT token).
//
// Request flow for protected routes:
//   Client -> Express -> CORS -> JSON Parser -> Logger
//          -> authenticate middleware (checks JWT)
//          -> Route Handler -> Response
//
// To test:
// 1. POST /api/auth/register with { username, email, password }
// 2. Copy the token from the response
// 3. Use it in the Authorization header: Bearer <token>
// 4. Now you can access protected routes like GET /api/tasks
// ============================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Route modules
const authRoutes = require('./routes/auth');
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
// HEALTH CHECK (public - no auth required)
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Session 6 Lab API with Authentication is running!',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// PUBLIC ROUTES (no authentication required)
// ============================================
// Auth routes must be public - users need to be able to
// register and login without already having a token!
app.use('/api/auth', authRoutes);

// ============================================
// PROTECTED ROUTES (authentication required)
// ============================================
// These route modules apply the authenticate middleware internally.
// Any request without a valid JWT token will get a 401 response.
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
        'GET    /api/tasks          (requires token)',
        'GET    /api/tasks/:id      (requires token)',
        'POST   /api/tasks          (requires token)',
        'PUT    /api/tasks/:id      (requires token)',
        'DELETE /api/tasks/:id      (requires token)',
        'GET    /api/users/profile  (requires token)',
        'PUT    /api/users/profile  (requires token)',
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
  console.log('  Session 6 Lab API (with Auth)');
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('  Public endpoints:');
  console.log(`    POST http://localhost:${PORT}/api/auth/register`);
  console.log(`    POST http://localhost:${PORT}/api/auth/login`);
  console.log('');
  console.log('  Protected endpoints (require Bearer token):');
  console.log(`    GET  http://localhost:${PORT}/api/tasks`);
  console.log(`    GET  http://localhost:${PORT}/api/users/profile`);
  console.log('========================================');
});

module.exports = app;
