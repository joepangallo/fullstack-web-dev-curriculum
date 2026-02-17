// ============================================
// TaskFlow - Test Setup
// ============================================
// Clears the test database before tests run.
// See the lab version (session-10-testing/lab) for
// detailed comments explaining each section.
// ============================================

const { PrismaClient } = require('@prisma/client');

require('dotenv').config({ path: '.env.test' });

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (error) {
    console.warn('Warning: Could not clear database tables.', error.message);
    console.warn('Make sure you have run: npx prisma migrate dev');
  }
}

async function disconnectDatabase() {
  await prisma.$disconnect();
}

module.exports = {
  prisma,
  clearDatabase,
  disconnectDatabase
};
