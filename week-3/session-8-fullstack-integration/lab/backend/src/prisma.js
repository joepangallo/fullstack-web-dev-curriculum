/**
 * =============================================================
 * PRISMA CLIENT - Database Connection Singleton
 * =============================================================
 *
 * This module creates and exports a single Prisma Client instance
 * that is shared across the entire application.
 *
 * WHY A SINGLETON?
 *   Prisma Client manages a connection pool to the database.
 *   Creating multiple instances would create multiple pools,
 *   wasting resources and potentially hitting connection limits.
 *
 * PATTERN:
 *   We create one PrismaClient, configure it, and export it.
 *   Every module that needs database access imports this file.
 *
 * COMMONJS NOTE:
 *   This backend uses CommonJS (require/module.exports) as
 *   specified for this curriculum. This is still common in
 *   Express.js projects.
 * =============================================================
 */

const { PrismaClient } = require('@prisma/client');

// Create a single Prisma Client instance
// The 'log' option enables query logging in development
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error'] // Verbose logging in development
      : ['error'],                           // Only errors in production
});

// Export the singleton instance
module.exports = prisma;
