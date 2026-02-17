// ============================================
// Session 4 TaskFlow: Prisma Client Singleton
// ============================================
// Shared PrismaClient instance for the TaskFlow application.
// Uses the singleton pattern to maintain a single database connection pool.
//
// Usage: const { prisma } = require('./prisma');
// ============================================

const { PrismaClient } = require('@prisma/client');

// Reuse existing client during development hot-reloads
if (!globalThis.__prisma) {
  globalThis.__prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
}

const prisma = globalThis.__prisma;

module.exports = { prisma };
