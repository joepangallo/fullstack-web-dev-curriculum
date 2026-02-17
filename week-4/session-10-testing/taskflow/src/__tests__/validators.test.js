// ============================================
// TaskFlow - Unit Tests: Validators
// ============================================
// Tests for all TaskFlow validator functions.
// Extends the lab tests with TaskFlow-specific
// validators: isValidPriority and isValidDueDate.
//
// See the lab version for detailed comments on
// Jest testing patterns and matchers.
// ============================================

const {
  isValidEmail,
  isValidPassword,
  sanitizeInput,
  isValidTaskStatus,
  isValidPriority,
  isValidDueDate
} = require('../utils/validators');

// ============================================
// EMAIL VALIDATION
// ============================================
describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('first.last@company.co')).toBe(true);
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });

  it('should return false for invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user @example.com')).toBe(false);
  });

  it('should handle non-string inputs', () => {
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(42)).toBe(false);
    expect(isValidEmail({})).toBe(false);
  });
});

// ============================================
// PASSWORD VALIDATION
// ============================================
describe('isValidPassword', () => {
  it('should return true for valid passwords', () => {
    expect(isValidPassword('abc123')).toBe(true);
    expect(isValidPassword('Password1')).toBe(true);
    expect(isValidPassword('str0ng!Pass')).toBe(true);
  });

  it('should return false for passwords that are too short', () => {
    expect(isValidPassword('ab1')).toBe(false);
    expect(isValidPassword('a1b2c')).toBe(false);
  });

  it('should return false for passwords missing letters', () => {
    expect(isValidPassword('123456')).toBe(false);
    expect(isValidPassword('!@#$%^')).toBe(false);
  });

  it('should return false for passwords missing numbers', () => {
    expect(isValidPassword('abcdef')).toBe(false);
    expect(isValidPassword('Password')).toBe(false);
  });

  it('should handle non-string inputs', () => {
    expect(isValidPassword(null)).toBe(false);
    expect(isValidPassword(undefined)).toBe(false);
    expect(isValidPassword(123456)).toBe(false);
  });
});

// ============================================
// SANITIZE INPUT
// ============================================
describe('sanitizeInput', () => {
  it('should trim whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('should escape HTML special characters', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('should escape ampersands', () => {
    expect(sanitizeInput('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('should escape single quotes', () => {
    expect(sanitizeInput("it's")).toBe('it&#x27;s');
  });

  it('should handle non-string inputs', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput(42)).toBe('');
    expect(sanitizeInput([])).toBe('');
  });
});

// ============================================
// TASK STATUS VALIDATION
// ============================================
describe('isValidTaskStatus', () => {
  it('should return true for valid statuses', () => {
    expect(isValidTaskStatus('pending')).toBe(true);
    expect(isValidTaskStatus('in-progress')).toBe(true);
    expect(isValidTaskStatus('completed')).toBe(true);
  });

  it('should return false for invalid statuses', () => {
    expect(isValidTaskStatus('done')).toBe(false);
    expect(isValidTaskStatus('PENDING')).toBe(false);
    expect(isValidTaskStatus('')).toBe(false);
    expect(isValidTaskStatus('cancelled')).toBe(false);
  });

  it('should handle non-string inputs', () => {
    expect(isValidTaskStatus(null)).toBe(false);
    expect(isValidTaskStatus(undefined)).toBe(false);
    expect(isValidTaskStatus(1)).toBe(false);
  });
});

// ============================================
// PRIORITY VALIDATION (TaskFlow-specific)
// ============================================
describe('isValidPriority', () => {
  it('should return true for valid priorities', () => {
    expect(isValidPriority('low')).toBe(true);
    expect(isValidPriority('medium')).toBe(true);
    expect(isValidPriority('high')).toBe(true);
  });

  it('should return false for invalid priorities', () => {
    expect(isValidPriority('urgent')).toBe(false);
    expect(isValidPriority('LOW')).toBe(false);
    expect(isValidPriority('Medium')).toBe(false);
    expect(isValidPriority('')).toBe(false);
    expect(isValidPriority('critical')).toBe(false);
  });

  it('should handle non-string inputs', () => {
    expect(isValidPriority(null)).toBe(false);
    expect(isValidPriority(undefined)).toBe(false);
    expect(isValidPriority(1)).toBe(false);
    expect(isValidPriority(true)).toBe(false);
  });
});

// ============================================
// DUE DATE VALIDATION (TaskFlow-specific)
// ============================================
describe('isValidDueDate', () => {
  it('should return true for a future date', () => {
    // Create a date 7 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    expect(isValidDueDate(futureDate.toISOString())).toBe(true);
  });

  it('should return true for today', () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0); // Noon today
    expect(isValidDueDate(today.toISOString())).toBe(true);
  });

  it('should return false for a past date', () => {
    const pastDate = new Date('2020-01-01');
    expect(isValidDueDate(pastDate.toISOString())).toBe(false);
  });

  it('should return false for an invalid date string', () => {
    expect(isValidDueDate('not-a-date')).toBe(false);
    expect(isValidDueDate('2025-13-45')).toBe(false);
    expect(isValidDueDate('')).toBe(false);
  });

  it('should handle non-string inputs', () => {
    expect(isValidDueDate(null)).toBe(false);
    expect(isValidDueDate(undefined)).toBe(false);
    expect(isValidDueDate(12345)).toBe(false);
  });
});
