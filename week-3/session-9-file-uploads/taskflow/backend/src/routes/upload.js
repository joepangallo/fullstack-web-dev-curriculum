/**
 * =============================================================
 * TASKFLOW - UPLOAD ROUTES
 * =============================================================
 *
 * Same Multer upload configuration as the lab.
 * Handles avatar uploads and profile retrieval.
 * =============================================================
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../prisma');

const router = express.Router();

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Only allow image files
function fileFilter(req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/users/avatar - Upload avatar
router.post('/avatar', upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    // Delete old avatar file if it exists
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { avatarUrl: true },
    });

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl },
      select: { id: true, username: true, email: true, avatarUrl: true },
    });

    if (currentUser?.avatarUrl) {
      const oldPath = path.join(__dirname, '..', '..', currentUser.avatarUrl);
      fs.unlink(oldPath, () => {}); // Best-effort cleanup
    }

    res.json({ message: 'Avatar uploaded', avatarUrl, user: updatedUser });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/profile - Get user profile
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
        _count: { select: { tasks: true } },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({
      user: { ...user, taskCount: user._count.tasks, _count: undefined },
    });
  } catch (error) {
    next(error);
  }
});

// Multer error handling
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum is 5MB.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err.message?.includes('Only image files')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
