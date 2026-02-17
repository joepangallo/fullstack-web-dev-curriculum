// ============================================
// Test Setup File
// ============================================
// This file runs BEFORE each test file.
// Its job is to ensure we have a clean test database.
//
// Why do we need this?
// - Tests should be INDEPENDENT: each test should not
//   depend on data created by another test
// - Tests should be REPEATABLE: running them twice
//   should give the same result
// - A clean database ensures both properties
//
// This file is referenced in jest.config.js under
// "setupFilesAfterFramework"
// ============================================

const { PrismaClient } = require('@prisma/client');

// Load test environment variables
// This ensures we connect to the TEST database, not dev/prod
require('dotenv').config({ path: '.env.test' });

const prisma = new PrismaClient();

/**
 * Clears all data from the test database.
 *
 * IMPORTANT: Order matters due to foreign keys!
 * We must delete tasks BEFORE users because tasks
 * reference users (foreign key constraint).
 *
 * If we tried to delete users first, PostgreSQL would
 * throw an error because tasks still reference those users.
 * (Unless we have ON DELETE CASCADE, but it's good practice
 * to be explicit in tests.)
 */
async function clearDatabase() {
  try {
    // Delete in order: children first, then parents
    // Tasks reference users, so delete tasks first
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (error) {
    // If tables don't exist yet (first run before migration),
    // that's okay - just log it and continue
    console.warn('Warning: Could not clear database tables.', error.message);
    console.warn('Make sure you have run: npx prisma migrate dev');
  }
}

/**
 * Disconnect Prisma after all tests complete.
 * This prevents "open handle" warnings from Jest.
 *
 * Jest detects when your code has open connections
 * (like database connections) and warns you. Disconnecting
 * Prisma in afterAll prevents this warning.
 */
async function disconnectDatabase() {
  await prisma.$disconnect();
}

// Export utilities so test files can use them
module.exports = {
  prisma,
  clearDatabase,
  disconnectDatabase
};
