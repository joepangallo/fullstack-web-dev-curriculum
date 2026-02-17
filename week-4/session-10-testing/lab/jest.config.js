// ============================================
// Jest Configuration
// ============================================
// Jest is our test runner - it finds test files,
// runs them, and reports results.
//
// Key concepts:
//   testEnvironment: "node" - we're testing a backend (not a browser)
//   setupFilesAfterFramework: runs before each test file
//   testMatch: glob patterns to find test files
//   verbose: show individual test results
// ============================================

module.exports = {
  // We're testing Node.js code, not browser code
  testEnvironment: 'node',

  // Run this setup file before tests execute
  // This is where we clear the test database
  setupFilesAfterFramework: ['./src/__tests__/setup.js'],

  // Where to find test files
  // Jest looks for files ending in .test.js or .spec.js
  testMatch: [
    '**/src/__tests__/**/*.test.js',
    '**/src/__tests__/**/*.spec.js'
  ],

  // Show each test name as it runs (not just dots)
  verbose: true,

  // Load test environment variables BEFORE tests run
  // dotenv reads .env.test so DATABASE_URL points to test DB
  setupFiles: ['dotenv/config'],

  // Tell dotenv to use .env.test instead of .env
  // This ensures tests never touch the dev database
  globals: {
    'process.env.DOTENV_CONFIG_PATH': '.env.test'
  },

  // Timeout for each test (in milliseconds)
  // Database operations can be slow, so we give 10 seconds
  testTimeout: 10000,

  // Don't transform node_modules (we're using CommonJS, not ESM)
  transformIgnorePatterns: ['node_modules/']
};
