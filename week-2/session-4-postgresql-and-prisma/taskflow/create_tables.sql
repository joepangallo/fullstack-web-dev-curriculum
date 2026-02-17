-- ============================================
-- Session 4 TaskFlow: PostgreSQL Table Creation
-- ============================================
-- Database schema for the TaskFlow project management application.
-- TaskFlow helps teams organize and track their project tasks.
--
-- To run: psql -U your_username -d taskflow_db -f create_tables.sql
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores TaskFlow user accounts.
-- Each user can own multiple tasks and be part of project teams.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,                        -- Unique user identifier
  username VARCHAR(50) UNIQUE NOT NULL,         -- Login username
  email VARCHAR(100) UNIQUE NOT NULL,           -- User's email address
  password_hash VARCHAR(255) NOT NULL,          -- Bcrypt-hashed password
  avatar_url VARCHAR(500),                      -- Profile picture URL
  created_at TIMESTAMP DEFAULT NOW()            -- Account creation timestamp
);

-- ============================================
-- TASKS TABLE
-- ============================================
-- Stores project tasks assigned to users.
-- Each task has a status that tracks its progress through the workflow.

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,                        -- Unique task identifier
  title VARCHAR(255) NOT NULL,                  -- Task title/summary
  description TEXT,                             -- Detailed task description
  status VARCHAR(20) DEFAULT 'pending'          -- Workflow status
    CHECK (status IN ('pending', 'in-progress', 'completed')),
  user_id INTEGER REFERENCES users(id)          -- Task owner (foreign key)
    ON DELETE CASCADE,                          -- Clean up tasks when user is removed
  created_at TIMESTAMP DEFAULT NOW(),           -- When task was created
  updated_at TIMESTAMP DEFAULT NOW()            -- Last modification time
);

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================
-- Indexes for common TaskFlow queries like filtering by user or status.

CREATE INDEX idx_tasks_user_id ON tasks(user_id);  -- Fast user task lookups
CREATE INDEX idx_tasks_status ON tasks(status);     -- Fast status filtering
