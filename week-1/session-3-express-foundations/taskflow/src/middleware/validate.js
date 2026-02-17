/**
 * validate.js - Request Validation Middleware
 * ---------------------------------------------
 * Validates incoming request data BEFORE it reaches the route handler.
 *
 * Why Validate in Middleware?
 *   1. Separation of Concerns — Route handlers focus on business logic,
 *      validation middleware handles data quality.
 *   2. Reusability — The same validation can be applied to multiple routes.
 *   3. Early Exit — Invalid requests are rejected immediately, before any
 *      processing or database operations happen.
 *
 * How It Works:
 *   This middleware function checks req.body for required fields and valid values.
 *   If validation fails, it sends a 400 Bad Request response and does NOT call next().
 *   If validation passes, it calls next() to continue to the route handler.
 *
 * Usage in routes:
 *   router.post('/', validateTaskCreation, (req, res) => { ... });
 *                     ^^^^^^^^^^^^^^^^^^^^^^
 *                     Runs BEFORE the route handler
 */

/**
 * Validate task creation data.
 * Checks:
 *   - title is required and non-empty
 *   - title must be 255 characters or less
 *   - status (if provided) must be one of: pending, in-progress, completed
 */
const validateTaskCreation = (req, res, next) => {
  const { title, status } = req.body;

  // Collect all validation errors (instead of returning on the first one)
  const errors = [];

  // Title validation
  if (!title || !title.trim()) {
    errors.push('Title is required');
  } else if (title.trim().length > 255) {
    errors.push('Title must be 255 characters or less');
  }

  // Status validation (optional field, but must be valid if provided)
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (status && !validStatuses.includes(status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  // If there are errors, send 400 and stop the middleware chain
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      messages: errors,
    });
  }

  // Validation passed! Continue to the route handler.
  next();
};

/**
 * Validate task update data.
 * More lenient than creation — no fields are strictly required,
 * but any provided field must be valid.
 */
const validateTaskUpdate = (req, res, next) => {
  const { title, status } = req.body;
  const errors = [];

  // Title validation (only if provided)
  if (title !== undefined) {
    if (!title.trim()) {
      errors.push('Title cannot be empty');
    } else if (title.trim().length > 255) {
      errors.push('Title must be 255 characters or less');
    }
  }

  // Status validation (only if provided)
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (status !== undefined && !validStatuses.includes(status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      messages: errors,
    });
  }

  next();
};

module.exports = { validateTaskCreation, validateTaskUpdate };
