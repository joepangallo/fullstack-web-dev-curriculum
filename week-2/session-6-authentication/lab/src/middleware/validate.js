// ============================================
// Session 6 Lab: Validation Middleware
// ============================================
// Validates request data before it reaches route handlers.
// Now includes validation for auth routes (register/login).
// ============================================

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

/**
 * Validates task data for create and update operations.
 * Note: In Session 6, userId comes from the JWT token (req.userId),
 * so we no longer require it in the request body for POST.
 */
const validateTask = (req, res, next) => {
  const { title, description, status } = req.body;
  const errors = [];

  // POST-specific validation
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string.');
    }
    if (title && title.length > 255) {
      errors.push('Title must be 255 characters or fewer.');
    }
  }

  // Shared validation
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
  }
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }

  // PUT-specific validation
  if (req.method === 'PUT') {
    const hasUpdate = title !== undefined || description !== undefined || status !== undefined;
    if (!hasUpdate) {
      errors.push('At least one field (title, description, status) must be provided for update.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Validates registration data.
 * Checks username, email format, and password strength.
 */
const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  // Username validation
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    errors.push('Username is required.');
  } else if (username.length > 50) {
    errors.push('Username must be 50 characters or fewer.');
  }

  // Email validation
  if (!email || typeof email !== 'string') {
    errors.push('Email is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email must be a valid email address.');
  }

  // Password validation
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
 * Validates login data.
 * Only checks that email and password are present (actual verification happens in the route).
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
