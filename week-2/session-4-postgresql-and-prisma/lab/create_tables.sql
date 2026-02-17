-- ============================================
-- Session 4 Lab: PostgreSQL Table Creation
-- ============================================
-- This file creates the database schema for our web application.
-- Run this file against your PostgreSQL database to set up the tables.
--
-- To run: psql -U your_username -d webdev_db -f create_tables.sql
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================
-- The users table stores account information for each registered user.
-- Key concepts:
--   SERIAL       = auto-incrementing integer (PostgreSQL generates the ID)
--   PRIMARY KEY  = uniquely identifies each row
--   UNIQUE       = no two rows can have the same value in this column
--   NOT NULL     = this column cannot be empty
--   VARCHAR(n)   = variable-length string up to n characters
--   TIMESTAMP    = date and time value
--   DEFAULT NOW()= automatically sets to current date/time when row is created

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,                        -- Auto-incrementing unique identifier
  username VARCHAR(50) UNIQUE NOT NULL,         -- Display name, must be unique
  email VARCHAR(100) UNIQUE NOT NULL,           -- Email address, must be unique
  password_hash VARCHAR(255) NOT NULL,          -- Hashed password (NEVER store plain text!)
  avatar_url VARCHAR(500),                      -- Optional profile picture URL
  created_at TIMESTAMP DEFAULT NOW()            -- When the account was created
);

-- ============================================
-- TASKS TABLE
-- ============================================
-- The tasks table stores to-do items that belong to users.
-- Key concepts:
--   REFERENCES   = creates a foreign key relationship to another table
--   ON DELETE CASCADE = if a user is deleted, their tasks are also deleted
--   CHECK        = ensures the value is one of the allowed options
--   TEXT         = unlimited length string (good for descriptions)

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,                        -- Auto-incrementing unique identifier
  title VARCHAR(255) NOT NULL,                  -- Task title (required)
  description TEXT,                             -- Optional detailed description
  status VARCHAR(20) DEFAULT 'pending'          -- Current status with validation
    CHECK (status IN ('pending', 'in-progress', 'completed')),
  user_id INTEGER REFERENCES users(id)          -- Links task to a user
    ON DELETE CASCADE,                          -- Delete tasks when user is deleted
  created_at TIMESTAMP DEFAULT NOW(),           -- When the task was created
  updated_at TIMESTAMP DEFAULT NOW()            -- When the task was last modified
);

-- ============================================
-- INDEXES
-- ============================================
-- Indexes speed up database lookups, similar to an index in a textbook.
-- Without indexes, PostgreSQL must scan every row to find matches.
-- With indexes, it can jump directly to matching rows.
--
-- We create indexes on columns we'll frequently search or filter by:

CREATE INDEX idx_tasks_user_id ON tasks(user_id);  -- Speed up: "find all tasks for user X"
CREATE INDEX idx_tasks_status ON tasks(status);     -- Speed up: "find all pending tasks"
