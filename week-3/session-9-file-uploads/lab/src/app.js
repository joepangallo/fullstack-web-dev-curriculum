/**
 * =============================================================
 * EXPRESS APPLICATION - With File Upload Support
 * =============================================================
 *
 * Builds on the Session 8 backend, adding:
 *   - Static file serving for uploaded files
 *   - Upload routes for user avatars
 *
 * NEW CONCEPTS:
 *   - express.static() serves files from a directory
 *   - Multer middleware handles multipart/form-data (file uploads)
 *   - Files are stored in the /uploads directory
 *   - The upload URL is stored in the database (User.avatarUrl)
 *
 * FILE UPLOAD FLOW:
 *   1. Client sends a POST with Content-Type: multipart/form-data
 *   2. Multer middleware intercepts and saves the file to disk
 *   3. Route handler receives file info via req.file
 *   4. Handler saves the file URL to the database
 *   5. Client can access the file via /uploads/filename
 * =============================================================
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import middleware
const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;

// =============================================================
// GLOBAL MIDDLEWARE
// =============================================================

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

/**
 * STATIC FILE SERVING
 *
 * express.static() serves files from a directory as-is.
 * This makes uploaded files accessible via HTTP:
 *
 *   File on disk: /uploads/1705345678-avatar.png
 *   Accessible at: http://localhost:3001/uploads/1705345678-avatar.png
 *
 * path.join(__dirname, '..', 'uploads') resolves to the /uploads
 * directory at the project root (one level up from /src).
 *
 * SECURITY NOTE:
 *   Only serve files from designated directories.
 *   Never serve your entire project directory!
 */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// =============================================================
// ROUTES
// =============================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Public auth routes
app.use('/api/auth', authRoutes);

// Protected task routes
app.use('/api/tasks', authMiddleware, taskRoutes);

// Protected upload routes (avatar upload, profile)
app.use('/api/users', authMiddleware, uploadRoutes);

// =============================================================
// ERROR HANDLING
// =============================================================

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

// =============================================================
// START SERVER
// =============================================================

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  Server running on http://localhost:${PORT}`);
  console.log(`  File uploads enabled`);
  console.log(`========================================\n`);
  console.log(`  API Endpoints:`);
  console.log(`  POST   /api/auth/register`);
  console.log(`  POST   /api/auth/login`);
  console.log(`  GET    /api/tasks`);
  console.log(`  POST   /api/tasks`);
  console.log(`  PUT    /api/tasks/:id`);
  console.log(`  PATCH  /api/tasks/:id`);
  console.log(`  DELETE /api/tasks/:id`);
  console.log(`  POST   /api/users/avatar    (upload)`);
  console.log(`  GET    /api/users/profile`);
  console.log(`  GET    /api/health\n`);
});

module.exports = app;
