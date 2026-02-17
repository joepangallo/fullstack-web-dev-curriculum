// ============================================
// TaskFlow - Jest Configuration
// ============================================
// This configuration tells Jest how to find and run our tests.
// See the lab version for detailed comments on each option.
// ============================================

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterFramework: ['./src/__tests__/setup.js'],
  testMatch: [
    '**/src/__tests__/**/*.test.js',
    '**/src/__tests__/**/*.spec.js'
  ],
  verbose: true,
  setupFiles: ['dotenv/config'],
  globals: {
    'process.env.DOTENV_CONFIG_PATH': '.env.test'
  },
  testTimeout: 10000,
  transformIgnorePatterns: ['node_modules/'],

  // Generate a coverage report when running with --coverage
  // This shows you which lines of code are tested
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/__tests__/**'
  ]
};
