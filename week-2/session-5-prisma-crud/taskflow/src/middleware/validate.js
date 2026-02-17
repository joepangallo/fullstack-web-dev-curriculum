// ============================================
// TaskFlow API: Validation Middleware
// ============================================
// Validates request data before it reaches route handlers.
// Returns 400 Bad Request with specific error messages if validation fails.
// ============================================

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

/**
 * Validates task data for create and update operations.
 */
const validateTask = (req, res, next) => {
  const { title, description, status, userId } = req.body;
  const errors = [];

  // POST-specific validation (creating a new task)
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string.');
    }
    if (title && title.length > 255) {
      errors.push('Title must be 255 characters or fewer.');
    }
    if (!userId && userId !== 0) {
      errors.push('userId is required.');
    } else if (typeof userId !== 'number' || !Number.isInteger(userId) || userId < 1) {
      errors.push('userId must be a positive integer.');
    }
  }

  // Shared validation
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
  }
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }

  // PUT-specific validation (updating)
  if (req.method === 'PUT') {
    const hasUpdate = title !== undefined || description !== undefined ||
                      status !== undefined || userId !== undefined;
    if (!hasUpdate) {
      errors.push('At least one field must be provided for update.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Validates user data for create and update operations.
 */
const validateUser = (req, res, next) => {
  const { username, email, passwordHash } = req.body;
  const errors = [];

  if (req.method === 'POST') {
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      errors.push('Username is required.');
    }
    if (!email || typeof email !== 'string') {
      errors.push('Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email must be a valid email address.');
    }
    if (!passwordHash || typeof passwordHash !== 'string') {
      errors.push('Password hash is required.');
    }
  }

  if (username && username.length > 50) {
    errors.push('Username must be 50 characters or fewer.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateTask, validateUser };
