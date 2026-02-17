// ============================================
// Session 5 Lab: Validation Middleware
// ============================================
// Validation middleware checks that incoming request data is correct
// BEFORE it reaches your route handlers. This keeps your routes clean
// and ensures bad data never hits the database.
//
// Think of it as a bouncer at a club - checking IDs before people enter.
// ============================================

// ============================================
// VALID TASK STATUSES
// ============================================
// Define allowed values in one place so they're easy to update.
const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

/**
 * Validates task data for POST and PUT requests.
 * Checks that required fields are present and values are valid.
 *
 * For POST (creating): title is required
 * For PUT (updating): at least one field must be provided
 */
const validateTask = (req, res, next) => {
  const { title, description, status, userId } = req.body;
  const errors = [];

  // ============================================
  // POST validation (creating a new task)
  // ============================================
  if (req.method === 'POST') {
    // Title is required for new tasks
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string.');
    }

    // Title length check
    if (title && title.length > 255) {
      errors.push('Title must be 255 characters or fewer.');
    }

    // userId is required - we need to know who owns the task
    if (!userId && userId !== 0) {
      errors.push('userId is required.');
    } else if (typeof userId !== 'number' || !Number.isInteger(userId) || userId < 1) {
      errors.push('userId must be a positive integer.');
    }
  }

  // ============================================
  // Shared validation (both POST and PUT)
  // ============================================

  // If status is provided, it must be one of our valid options
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(
      `Status must be one of: ${VALID_STATUSES.join(', ')}. Received: "${status}"`
    );
  }

  // Description length check (if provided)
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }

  // ============================================
  // PUT validation (updating an existing task)
  // ============================================
  if (req.method === 'PUT') {
    // At least one field must be provided for an update
    const hasUpdate = title !== undefined || description !== undefined ||
                      status !== undefined || userId !== undefined;
    if (!hasUpdate) {
      errors.push('At least one field (title, description, status, userId) must be provided for update.');
    }
  }

  // ============================================
  // Return errors or continue
  // ============================================
  if (errors.length > 0) {
    // 400 Bad Request - the client sent invalid data
    return res.status(400).json({ errors });
  }

  // Validation passed! Move to the next middleware/route handler.
  next();
};

/**
 * Validates user data for POST and PUT requests.
 */
const validateUser = (req, res, next) => {
  const { username, email, passwordHash } = req.body;
  const errors = [];

  if (req.method === 'POST') {
    // Username is required
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      errors.push('Username is required.');
    }

    // Email is required and must look like an email
    if (!email || typeof email !== 'string') {
      errors.push('Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // Simple email regex: something@something.something
      errors.push('Email must be a valid email address.');
    }

    // Password hash is required (in a real app, you'd hash the password in the route)
    if (!passwordHash || typeof passwordHash !== 'string') {
      errors.push('Password hash is required.');
    }
  }

  // Username length check
  if (username && username.length > 50) {
    errors.push('Username must be 50 characters or fewer.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateTask, validateUser };
