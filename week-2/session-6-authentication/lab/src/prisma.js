// ============================================
// Session 6 Lab: Prisma Client Singleton
// ============================================
// Shared database connection for the authenticated API.
//
// Usage: const { prisma } = require('./prisma');
// ============================================

const { PrismaClient } = require('@prisma/client');

if (!globalThis.__prisma) {
  globalThis.__prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
}

const prisma = globalThis.__prisma;

module.exports = { prisma };
