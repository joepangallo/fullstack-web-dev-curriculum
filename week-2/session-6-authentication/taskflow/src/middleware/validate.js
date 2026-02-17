// ============================================
// TaskFlow API: Validation Middleware
// ============================================
// Input validation for TaskFlow routes including auth validation.
// ============================================

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

/**
 * Validates task data for create and update operations.
 * In the authenticated version, userId comes from the JWT token,
 * so it is not required in the request body.
 */
const validateTask = (req, res, next) => {
  const { title, description, status } = req.body;
  const errors = [];

  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string.');
    }
    if (title && title.length > 255) {
      errors.push('Title must be 255 characters or fewer.');
    }
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
  }
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }

  if (req.method === 'PUT') {
    const hasUpdate = title !== undefined || description !== undefined || status !== undefined;
    if (!hasUpdate) {
      errors.push('At least one field (title, description, status) must be provided.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Validates registration data for new TaskFlow accounts.
 */
const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    errors.push('Username is required.');
  } else if (username.length > 50) {
    errors.push('Username must be 50 characters or fewer.');
  }

  if (!email || typeof email !== 'string') {
    errors.push('Email is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email must be a valid email address.');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Validates login credentials.
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string') {
    errors.push('Email is required.');
  }
  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateTask, validateRegister, validateLogin };
