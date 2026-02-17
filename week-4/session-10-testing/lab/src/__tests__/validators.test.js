// ============================================
// Unit Tests: Validators
// ============================================
// These are UNIT TESTS - they test individual functions
// in isolation, without databases or HTTP requests.
//
// Unit tests are:
//   - Fast (no I/O, no network)
//   - Reliable (no external dependencies that might fail)
//   - Simple (test one thing at a time)
//
// Jest test structure:
//   describe('group name', () => {   // Groups related tests
//     it('should do X', () => {      // Individual test case
//       expect(value).toBe(expected) // Assertion
//     });
//   });
//
// Common matchers:
//   .toBe(value)       - strict equality (===)
//   .toEqual(value)    - deep equality (for objects/arrays)
//   .toBeTruthy()      - truthy value
//   .toBeFalsy()       - falsy value
//   .toContain(item)   - array/string contains item
// ============================================

const {
  isValidEmail,
  isValidPassword,
  sanitizeInput,
  isValidTaskStatus
} = require('../utils/validators');

// ============================================
// EMAIL VALIDATION TESTS
// ============================================
describe('isValidEmail', () => {
  // --- Valid emails ---
  // Test the "happy path" first - inputs that SHOULD pass
  it('should return true for a standard email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('should return true for an email with subdomain', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true);
  });

  it('should return true for an email with dots in local part', () => {
    expect(isValidEmail('first.last@example.com')).toBe(true);
  });

  it('should return true for an email with plus addressing', () => {
    // Gmail and other providers support "+" for filtering
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });

  it('should return true for an email with numbers', () => {
    expect(isValidEmail('user123@example456.com')).toBe(true);
  });

  it('should handle emails with leading/trailing whitespace', () => {
    // Our validator trims whitespace before checking
    expect(isValidEmail('  user@example.com  ')).toBe(true);
  });

  // --- Invalid emails ---
  // Test "edge cases" and bad inputs
  it('should return false for an empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('should return false for a string without @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('should return false for a string without domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('should return false for a string without TLD', () => {
    expect(isValidEmail('user@example')).toBe(false);
  });

  it('should return false for a string with single-char TLD', () => {
    // TLDs must be at least 2 characters
    expect(isValidEmail('user@example.c')).toBe(false);
  });

  it('should return false for a string with spaces in the middle', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
  });

  it('should return false for multiple @ symbols', () => {
    expect(isValidEmail('user@@example.com')).toBe(false);
  });

  // --- Type checking ---
  // What happens with non-string inputs?
  it('should return false for null', () => {
    expect(isValidEmail(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isValidEmail(undefined)).toBe(false);
  });

  it('should return false for a number', () => {
    expect(isValidEmail(12345)).toBe(false);
  });

  it('should return false for an object', () => {
    expect(isValidEmail({ email: 'test@example.com' })).toBe(false);
  });
});

// ============================================
// PASSWORD VALIDATION TESTS
// ============================================
describe('isValidPassword', () => {
  // --- Valid passwords ---
  it('should return true for a password with letters and numbers (6+ chars)', () => {
    expect(isValidPassword('abc123')).toBe(true);
  });

  it('should return true for a longer mixed password', () => {
    expect(isValidPassword('MySecurePass1')).toBe(true);
  });

  it('should return true for a password with special characters', () => {
    // Special chars are allowed, just not required
    expect(isValidPassword('p@ssw0rd!')).toBe(true);
  });

  it('should return true for exactly 6 characters with letter and number', () => {
    // Boundary test: exactly at the minimum length
    expect(isValidPassword('test1a')).toBe(true);
  });

  // --- Invalid passwords ---
  it('should return false for a password shorter than 6 characters', () => {
    expect(isValidPassword('ab1')).toBe(false);
  });

  it('should return false for exactly 5 characters', () => {
    // Boundary test: one below minimum
    expect(isValidPassword('abc12')).toBe(false);
  });

  it('should return false for letters only (no numbers)', () => {
    expect(isValidPassword('abcdef')).toBe(false);
  });

  it('should return false for numbers only (no letters)', () => {
    expect(isValidPassword('123456')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isValidPassword('')).toBe(false);
  });

  it('should return false for only special characters', () => {
    expect(isValidPassword('!@#$%^')).toBe(false);
  });

  // --- Type checking ---
  it('should return false for null', () => {
    expect(isValidPassword(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isValidPassword(undefined)).toBe(false);
  });

  it('should return false for a number', () => {
    expect(isValidPassword(123456)).toBe(false);
  });
});

// ============================================
// SANITIZE INPUT TESTS
// ============================================
describe('sanitizeInput', () => {
  // --- Basic functionality ---
  it('should trim whitespace from both ends', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('should return the same string if no special characters', () => {
    expect(sanitizeInput('Hello World')).toBe('Hello World');
  });

  // --- HTML escaping ---
  // These tests verify XSS protection
  it('should escape < and > characters', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('should escape & characters', () => {
    expect(sanitizeInput('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('should escape double quotes', () => {
    expect(sanitizeInput('He said "hello"')).toBe('He said &quot;hello&quot;');
  });

  it('should escape single quotes', () => {
    expect(sanitizeInput("It's a test")).toBe('It&#x27;s a test');
  });

  it('should handle a string with multiple special characters', () => {
    const input = '<div class="test">O\'Brien & Co.</div>';
    const expected = '&lt;div class=&quot;test&quot;&gt;O&#x27;Brien &amp; Co.&lt;/div&gt;';
    expect(sanitizeInput(input)).toBe(expected);
  });

  // --- Edge cases ---
  it('should return empty string for empty input', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('should return empty string for whitespace-only input', () => {
    expect(sanitizeInput('   ')).toBe('');
  });

  // --- Type checking ---
  it('should return empty string for null', () => {
    expect(sanitizeInput(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(sanitizeInput(undefined)).toBe('');
  });

  it('should return empty string for a number', () => {
    expect(sanitizeInput(42)).toBe('');
  });

  it('should return empty string for an array', () => {
    expect(sanitizeInput(['hello'])).toBe('');
  });
});

// ============================================
// TASK STATUS VALIDATION TESTS
// ============================================
describe('isValidTaskStatus', () => {
  // --- Valid statuses ---
  // These match the CHECK constraint in our database schema
  it('should return true for "pending"', () => {
    expect(isValidTaskStatus('pending')).toBe(true);
  });

  it('should return true for "in-progress"', () => {
    expect(isValidTaskStatus('in-progress')).toBe(true);
  });

  it('should return true for "completed"', () => {
    expect(isValidTaskStatus('completed')).toBe(true);
  });

  // --- Invalid statuses ---
  it('should return false for "done"', () => {
    expect(isValidTaskStatus('done')).toBe(false);
  });

  it('should return false for "active"', () => {
    expect(isValidTaskStatus('active')).toBe(false);
  });

  it('should return false for "PENDING" (case-sensitive)', () => {
    // Status checking is case-sensitive!
    expect(isValidTaskStatus('PENDING')).toBe(false);
  });

  it('should return false for "Completed" (case-sensitive)', () => {
    expect(isValidTaskStatus('Completed')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isValidTaskStatus('')).toBe(false);
  });

  it('should return false for a string with extra spaces', () => {
    expect(isValidTaskStatus(' pending ')).toBe(false);
  });

  // --- Type checking ---
  it('should return false for null', () => {
    expect(isValidTaskStatus(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isValidTaskStatus(undefined)).toBe(false);
  });

  it('should return false for a number', () => {
    expect(isValidTaskStatus(1)).toBe(false);
  });

  it('should return false for a boolean', () => {
    expect(isValidTaskStatus(true)).toBe(false);
  });
});
