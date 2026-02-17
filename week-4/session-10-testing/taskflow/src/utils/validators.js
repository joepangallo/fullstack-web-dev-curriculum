// ============================================
// TaskFlow - Utility Functions: Validators
// ============================================
// Validation functions for TaskFlow data.
// These extend the lab validators with TaskFlow-specific
// validations like priority and due dates.
// ============================================

/**
 * Validates an email address format.
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates password strength.
 * Requirements: 6+ chars, at least one letter and one number.
 * @param {string} password - The password to validate
 * @returns {boolean} True if valid
 */
function isValidPassword(password) {
  if (typeof password !== 'string') return false;
  if (password.length < 6) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

/**
 * Sanitizes user input to prevent XSS attacks.
 * Trims whitespace and escapes HTML special characters.
 * @param {string} str - The string to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validates that a task status is one of the allowed values.
 * Allowed: 'pending', 'in-progress', 'completed'
 * @param {string} status - The status to validate
 * @returns {boolean} True if valid
 */
function isValidTaskStatus(status) {
  const allowedStatuses = ['pending', 'in-progress', 'completed'];
  return typeof status === 'string' && allowedStatuses.includes(status);
}

/**
 * Validates that a task priority is one of the allowed values.
 * TaskFlow-specific: tasks have priority levels.
 * Allowed: 'low', 'medium', 'high'
 * @param {string} priority - The priority to validate
 * @returns {boolean} True if valid
 */
function isValidPriority(priority) {
  const allowedPriorities = ['low', 'medium', 'high'];
  return typeof priority === 'string' && allowedPriorities.includes(priority);
}

/**
 * Validates that a due date string is a valid future date.
 * TaskFlow-specific: tasks can have optional due dates.
 * @param {string} dateString - An ISO date string to validate
 * @returns {boolean} True if valid and in the future (or today)
 */
function isValidDueDate(dateString) {
  if (typeof dateString !== 'string') return false;

  const date = new Date(dateString);

  // Check if the date is valid (NaN check)
  if (isNaN(date.getTime())) return false;

  // Due date should be today or in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  return date >= today;
}

module.exports = {
  isValidEmail,
  isValidPassword,
  sanitizeInput,
  isValidTaskStatus,
  isValidPriority,
  isValidDueDate
};
