-- ============================================
-- Session 4 Lab: Seed Data
-- ============================================
-- This file inserts sample data into our tables for testing and development.
-- The password hashes below are bcrypt-style placeholders.
-- In a real app, you'd generate these with bcrypt.hash('password', 10)
--
-- To run: psql -U your_username -d webdev_db -f seed_data.sql
-- ============================================

-- ============================================
-- INSERT USERS
-- ============================================
-- INSERT INTO adds new rows to a table.
-- We list the columns we're providing values for, then the VALUES.
-- The 'id' column is omitted because SERIAL auto-generates it.
--
-- NOTE: These password hashes are placeholders. In production,
-- you would NEVER put real passwords in a SQL file.
-- The format mimics bcrypt: $2b$10$ followed by 53 characters.

INSERT INTO users (username, email, password_hash, avatar_url) VALUES
  (
    'alice_dev',
    'alice@example.com',
    '$2b$10$xJ8Kq3LmN9vR2wF5tY7uZeQpA1sD4gH6jK8lM0nO3pR5tU7vX9yB',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
  ),
  (
    'bob_coder',
    'bob@example.com',
    '$2b$10$aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9i',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
  ),
  (
    'carol_smith',
    'carol@example.com',
    '$2b$10$zY9xW8vU7tS6rQ5pO4nM3lK2jI1hG0fE9dC8bA7zY6xW5vU4tS3r',
    NULL  -- Carol hasn't uploaded an avatar yet
  );

-- ============================================
-- INSERT TASKS
-- ============================================
-- We insert 8 tasks spread across the 3 users.
-- The user_id values (1, 2, 3) match the auto-generated IDs from above.
-- Tasks have different statuses to demonstrate filtering later.

INSERT INTO tasks (title, description, status, user_id) VALUES
  -- Alice's tasks (user_id = 1)
  (
    'Learn SQL basics',
    'Study SELECT, INSERT, UPDATE, DELETE statements and practice with sample databases.',
    'completed',
    1
  ),
  (
    'Build a REST API',
    'Create Express.js endpoints for CRUD operations on a task manager.',
    'in-progress',
    1
  ),
  (
    'Set up PostgreSQL locally',
    'Install PostgreSQL, create a database, and connect from Node.js.',
    'completed',
    1
  ),

  -- Bob's tasks (user_id = 2)
  (
    'Study Prisma ORM',
    'Read the Prisma docs and understand models, migrations, and queries.',
    'in-progress',
    2
  ),
  (
    'Practice JOIN queries',
    'Write SQL queries that combine data from multiple tables using JOIN.',
    'pending',
    2
  ),
  (
    'Deploy to production',
    'Set up a cloud database and deploy the Express API.',
    'pending',
    2
  ),

  -- Carol's tasks (user_id = 3)
  (
    'Design database schema',
    'Plan the tables, relationships, and constraints for the project.',
    'completed',
    3
  ),
  (
    'Write seed data scripts',
    'Create SQL files with sample data for testing the application.',
    'in-progress',
    3
  );

-- ============================================
-- VERIFY: Check what was inserted
-- ============================================
-- After running the seed file, these queries show what was created:

-- Show all users (without password hashes for security)
SELECT id, username, email, created_at FROM users;

-- Show all tasks with their owner's username
SELECT t.id, t.title, t.status, u.username AS owner
FROM tasks t
JOIN users u ON t.user_id = u.id
ORDER BY t.id;
