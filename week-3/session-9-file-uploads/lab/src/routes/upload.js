/**
 * =============================================================
 * UPLOAD ROUTES - File Upload with Multer
 * =============================================================
 *
 * Handles file uploads for user avatars using the Multer library.
 *
 * ENDPOINTS:
 *   POST /api/users/avatar  - Upload a new avatar image
 *   GET  /api/users/profile - Get user profile with avatar URL
 *
 * MULTER OVERVIEW:
 *   Multer is Express middleware for handling multipart/form-data,
 *   which is the encoding type used for file uploads.
 *
 *   When a file is uploaded:
 *     1. Multer receives the raw file data from the request
 *     2. Saves it to disk (or memory, depending on config)
 *     3. Attaches file info to req.file (single file) or
 *        req.files (multiple files)
 *
 * MULTER CONFIGURATION:
 *   - storage: Where and how to save files
 *     - diskStorage: Save to a directory on disk
 *     - memoryStorage: Keep in memory as Buffer
 *   - fileFilter: Which file types to accept
 *   - limits: Maximum file size
 *
 * FILE NAMING:
 *   We prefix filenames with Date.now() to avoid collisions.
 *   Two users uploading "photo.jpg" at different times get
 *   different filenames: "1705345678-photo.jpg", "1705345699-photo.jpg"
 * =============================================================
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../prisma');

const router = express.Router();

// =============================================================
// MULTER STORAGE CONFIGURATION
// =============================================================

/**
 * Disk Storage Engine
 *
 * Controls WHERE files are saved and WHAT they're named.
 *
 * destination: The directory to save files in
 *   - We use a callback to ensure the directory exists
 *   - Creates it if it doesn't exist (recursive: true)
 *
 * filename: How to name the saved file
 *   - We prepend Date.now() for uniqueness
 *   - Keep the original extension for proper MIME type handling
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Resolve the uploads directory path (relative to project root)
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');

    // Create the directory if it doesn't exist
    // recursive: true creates parent directories if needed
    fs.mkdirSync(uploadDir, { recursive: true });

    // cb(error, destination) - null error means success
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    // Generate a unique filename:
    // "1705345678-avatar.png" instead of just "avatar.png"
    //
    // This prevents filename collisions when multiple users
    // upload files with the same name.
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

/**
 * File Filter - Restrict Allowed File Types
 *
 * Only accept image files (JPEG, PNG, GIF, WebP).
 * This prevents users from uploading executables, scripts,
 * or other potentially dangerous files.
 *
 * We check BOTH:
 *   1. The MIME type (Content-Type header) - can be spoofed
 *   2. The file extension - can also be spoofed
 *
 * For production, consider also checking the file's magic bytes
 * (the first few bytes that identify the actual file type).
 *
 * @param {object} req - Express request
 * @param {object} file - The uploaded file info
 * @param {function} cb - Callback: cb(error, acceptFile)
 */
function fileFilter(req, file, cb) {
  // Allowed MIME types for images
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  // Allowed file extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  const mimeTypeOk = allowedMimeTypes.includes(file.mimetype);
  const extensionOk = allowedExtensions.includes(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimeTypeOk && extensionOk) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file with an error message
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
  }
}

/**
 * Create the Multer instance with our configuration.
 *
 * limits.fileSize: Maximum file size in bytes
 *   5 * 1024 * 1024 = 5MB
 *   This prevents users from uploading huge files that could
 *   fill up disk space or slow down the server.
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum
  },
});

// =============================================================
// ROUTES
// =============================================================

/**
 * POST /api/users/avatar
 *
 * Upload a user avatar image.
 *
 * MULTER MIDDLEWARE:
 *   upload.single('avatar') tells Multer to expect a single file
 *   in a form field named "avatar". After processing:
 *     - req.file contains the uploaded file info
 *     - req.file.filename is the saved filename
 *     - req.file.size is the file size in bytes
 *     - req.file.mimetype is the file type
 *
 * FLOW:
 *   1. Multer saves the file to /uploads
 *   2. We construct the file URL
 *   3. We update the user's avatarUrl in the database
 *   4. If the user had a previous avatar, delete the old file
 *   5. Return the new avatar URL
 *
 * CLIENT USAGE:
 *   const formData = new FormData();
 *   formData.append('avatar', fileInput.files[0]);
 *   await axios.post('/api/users/avatar', formData, {
 *     headers: { 'Content-Type': 'multipart/form-data' }
 *   });
 */
router.post('/avatar', upload.single('avatar'), async (req, res, next) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded. Please select an image file.',
      });
    }

    // Construct the URL path for the uploaded file
    // This is relative to the server root, e.g., "/uploads/1705345678-avatar.png"
    const avatarUrl = `/uploads/${req.file.filename}`;

    // Get the user's current avatar to delete the old file
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { avatarUrl: true },
    });

    // Update the user's avatar URL in the database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
      },
    });

    // Delete the old avatar file if it exists
    // This prevents orphaned files from accumulating on disk
    if (currentUser?.avatarUrl) {
      const oldFilePath = path.join(
        __dirname, '..', '..', currentUser.avatarUrl
      );
      fs.unlink(oldFilePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          // Log but don't fail the request - the upload itself succeeded
          console.error('Failed to delete old avatar:', err.message);
        }
      });
    }

    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl: updatedUser.avatarUrl,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/profile
 *
 * Return the authenticated user's profile including avatar URL.
 *
 * This endpoint provides user data that may have changed
 * since the JWT was issued (like the avatar URL).
 */
router.get('/profile', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        // Count the user's tasks
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      user: {
        ...user,
        taskCount: user._count.tasks,
        _count: undefined, // Remove the Prisma _count wrapper
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================
// MULTER ERROR HANDLING
// =============================================================

/**
 * Multer throws specific errors for common problems.
 * We handle them here to provide user-friendly messages.
 *
 * This is registered as error-handling middleware on the router.
 * It catches errors thrown by the upload middleware above.
 */
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          error: 'File is too large. Maximum size is 5MB.',
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          error: 'Unexpected file field. Use "avatar" as the field name.',
        });
      default:
        return res.status(400).json({
          error: `Upload error: ${err.message}`,
        });
    }
  }

  // Non-Multer errors (like our file filter rejection)
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({
      error: err.message,
    });
  }

  // Pass other errors to the global error handler
  next(err);
});

module.exports = router;
