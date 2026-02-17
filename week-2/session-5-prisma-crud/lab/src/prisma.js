// ============================================
// Session 5 Lab: Prisma Client Singleton
// ============================================
// Creates a single shared database connection for the entire app.
// This prevents creating too many database connections during development.
//
// Usage: const { prisma } = require('./prisma');
// ============================================

const { PrismaClient } = require('@prisma/client');

// Reuse the client across hot-reloads in development
if (!globalThis.__prisma) {
  globalThis.__prisma = new PrismaClient({
    // Log database queries during development (remove in production)
    log: ['query', 'info', 'warn', 'error'],
  });
}

const prisma = globalThis.__prisma;

module.exports = { prisma };
