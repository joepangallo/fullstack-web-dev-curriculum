/**
 * =============================================================
 * PRISMA CLIENT SINGLETON
 * =============================================================
 *
 * Single shared database connection instance.
 * Same as Session 8 - reused across the application.
 * =============================================================
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

module.exports = prisma;
