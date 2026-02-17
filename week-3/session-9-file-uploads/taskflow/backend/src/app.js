/**
 * =============================================================
 * TASKFLOW BACKEND - With File Upload Support
 * =============================================================
 *
 * Complete Express backend with auth, tasks CRUD, and avatar uploads.
 * This is the TaskFlow version of the Session 9 lab.
 * =============================================================
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;

// Global middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/users', authMiddleware, uploadRoutes);

// Error handling
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n  TaskFlow API running on http://localhost:${PORT}\n`);
});

module.exports = app;
