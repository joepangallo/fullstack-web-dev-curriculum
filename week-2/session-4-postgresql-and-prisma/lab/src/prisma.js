// ============================================
// Session 4 Lab: Prisma Client Singleton
// ============================================
// This file creates a single instance of PrismaClient that is shared
// across your entire application. This is called the "singleton pattern."
//
// WHY a singleton?
// - Each PrismaClient instance opens a database connection pool
// - Creating multiple instances wastes resources and can hit connection limits
// - During development with hot-reloading, new instances are created on every file change
// - The singleton pattern prevents these issues
//
// USAGE: const { prisma } = require('./prisma');
// ============================================

// Import PrismaClient from the generated client package
// This is generated when you run: npx prisma generate
const { PrismaClient } = require('@prisma/client');

// ============================================
// Singleton Pattern Explained
// ============================================
// globalThis is a global object available everywhere in Node.js.
// We store our PrismaClient instance on it so it survives hot-reloads.
//
// Flow:
// 1. First import: globalThis.__prisma is undefined, so we create a new client
// 2. Subsequent imports: globalThis.__prisma already exists, so we reuse it
// 3. This means only ONE database connection pool exists in the entire app

// Check if a PrismaClient instance already exists on the global object
if (!globalThis.__prisma) {
  // Create a new PrismaClient with logging enabled
  globalThis.__prisma = new PrismaClient({
    log: [
      'query', // Log all SQL queries (helpful for learning!)
      'info',  // Log informational messages
      'warn',  // Log warnings
      'error', // Log errors
    ],
  });
}

// Use the global instance
const prisma = globalThis.__prisma;

// Export the prisma client for use in other files
// Usage: const { prisma } = require('./prisma');
module.exports = { prisma };
