// ============================================
// Utility Functions: Validators
// ============================================
// These are "pure functions" - they take input and return output
// without side effects. This makes them PERFECT for unit testing!
//
// Why validate on the server?
// - Client-side validation can be bypassed (open DevTools, use Postman)
// - Server validation is our last line of defense
// - Always validate on BOTH client and server
// ============================================

/**
 * Validates an email address format.
 *
 * The regex checks for:
 *   - One or more characters before @
 *   - An @ symbol
 *   - One or more characters after @
 *   - A dot followed by 2+ characters (the TLD like .com, .org)
 *
 * Note: This is a simplified check. For production, consider
 * using a library like 'validator' for more thorough validation.
 *
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email format is valid
 */
function isValidEmail(email) {
  // Guard clause: if email isn't a string, it's not valid
  if (typeof email !== 'string') return false;

  // Regex breakdown:
  // ^           - start of string
  // [^\s@]+     - one or more chars that aren't whitespace or @
  // @           - literal @ symbol
  // [^\s@]+     - one or more chars that aren't whitespace or @
  // \.          - literal dot
  // [^\s@]{2,}  - two or more chars that aren't whitespace or @
  // $           - end of string
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates a password meets minimum security requirements.
 *
 * Requirements:
 *   - At least 6 characters long
 *   - Contains at least one letter (a-z or A-Z)
 *   - Contains at least one number (0-9)
 *
 * These are basic requirements for teaching. Production apps
 * typically require 8+ characters and may check against
 * lists of commonly breached passwords.
 *
 * @param {string} password - The password to validate
 * @returns {boolean} True if the password meets requirements
 */
function isValidPassword(password) {
  // Guard clause: must be a string
  if (typeof password !== 'string') return false;

  // Check minimum length
  if (password.length < 6) return false;

  // Check for at least one letter
  // /[a-zA-Z]/ matches any single letter
  const hasLetter = /[a-zA-Z]/.test(password);

  // Check for at least one number
  // /[0-9]/ matches any single digit (same as /\d/)
  const hasNumber = /[0-9]/.test(password);

  // Both conditions must be true
  return hasLetter && hasNumber;
}

/**
 * Sanitizes user input to prevent XSS (Cross-Site Scripting) attacks.
 *
 * XSS attacks happen when malicious users inject HTML/JavaScript
 * into your app. For example, if a user's "name" is:
 *   <script>alert('hacked!')</script>
 *
 * And you render it directly in HTML, the script would execute!
 *
 * This function:
 *   1. Trims whitespace from both ends
 *   2. Escapes HTML special characters so they display as text
 *
 * Note: For production, use a library like 'DOMPurify' or 'xss'.
 * This is a simplified version for learning purposes.
 *
 * @param {string} str - The string to sanitize
 * @returns {string} The sanitized string
 */
function sanitizeInput(str) {
  // Guard clause: if not a string, return empty string
  if (typeof str !== 'string') return '';

  return str
    .trim()                                    // Remove leading/trailing whitespace
    .replace(/&/g, '&amp;')                    // & must be first (or it double-encodes)
    .replace(/</g, '&lt;')                     // < becomes &lt; (prevents opening tags)
    .replace(/>/g, '&gt;')                     // > becomes &gt; (prevents closing tags)
    .replace(/"/g, '&quot;')                   // " becomes &quot; (prevents attribute injection)
    .replace(/'/g, '&#x27;');                  // ' becomes &#x27; (prevents attribute injection)
}

/**
 * Validates that a task status is one of the allowed values.
 *
 * Our database schema uses a CHECK constraint, but we should
 * also validate in our application code. This gives better
 * error messages than a database error.
 *
 * Allowed statuses match our Prisma schema / SQL CHECK constraint:
 *   - 'pending'     - Task hasn't been started
 *   - 'in-progress' - Task is currently being worked on
 *   - 'completed'   - Task is finished
 *
 * @param {string} status - The status to validate
 * @returns {boolean} True if the status is valid
 */
function isValidTaskStatus(status) {
  const allowedStatuses = ['pending', 'in-progress', 'completed'];
  return typeof status === 'string' && allowedStatuses.includes(status);
}

// ============================================
// Export all validators using CommonJS
// ============================================
// We use module.exports (CommonJS) because our backend
// uses require() syntax, not import/export (ESM).
module.exports = {
  isValidEmail,
  isValidPassword,
  sanitizeInput,
  isValidTaskStatus
};
