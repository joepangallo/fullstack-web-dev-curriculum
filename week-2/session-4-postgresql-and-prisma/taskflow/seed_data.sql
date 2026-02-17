-- ============================================
-- Session 4 TaskFlow: Seed Data
-- ============================================
-- Sample data for the TaskFlow project management application.
-- These users and tasks simulate a small development team working
-- on a web application project.
--
-- To run: psql -U your_username -d taskflow_db -f seed_data.sql
-- ============================================

-- ============================================
-- TEAM MEMBERS
-- ============================================
-- Three developers working on the TaskFlow project itself.
-- Password hashes are bcrypt-style placeholders for development.

INSERT INTO users (username, email, password_hash, avatar_url) VALUES
  (
    'sarah_lead',
    'sarah@taskflow.dev',
    '$2b$10$rT6kL3mN9pQ2sV5wY8zA1bC4dF7gI0jK2lN5oR8sU1vX4yB7dE0g',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  ),
  (
    'marcus_dev',
    'marcus@taskflow.dev',
    '$2b$10$hG3fE2dC1bA0zY9xW8vU7tS6rQ5pO4nM3lK2jI1hG0fE9dC8bA7z',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus'
  ),
  (
    'priya_design',
    'priya@taskflow.dev',
    '$2b$10$mN5oR8sU1vX4yB7dE0gH3fE2dC1bA0zY9xW8vU7tS6rQ5pO4nM3l',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=priya'
  );

-- ============================================
-- PROJECT TASKS
-- ============================================
-- Tasks representing real project management work.
-- Spread across team members with varying statuses.

INSERT INTO tasks (title, description, status, user_id) VALUES
  -- Sarah's tasks (Tech Lead, user_id = 1)
  (
    'Set up project repository',
    'Initialize GitHub repo, configure branch protection rules, and set up CI/CD pipeline.',
    'completed',
    1
  ),
  (
    'Design database schema',
    'Create ERD diagram, define tables, relationships, and constraints for TaskFlow MVP.',
    'completed',
    1
  ),
  (
    'Code review: authentication module',
    'Review Marcus pull request for JWT auth implementation. Check security best practices.',
    'in-progress',
    1
  ),

  -- Marcus's tasks (Backend Developer, user_id = 2)
  (
    'Implement user authentication',
    'Build registration and login endpoints with bcrypt password hashing and JWT tokens.',
    'in-progress',
    2
  ),
  (
    'Build task CRUD API',
    'Create Express routes for creating, reading, updating, and deleting tasks with Prisma.',
    'pending',
    2
  ),
  (
    'Write API integration tests',
    'Set up Jest testing framework and write tests for all API endpoints.',
    'pending',
    2
  ),

  -- Priya's tasks (Designer/Frontend, user_id = 3)
  (
    'Create UI wireframes',
    'Design low-fidelity wireframes for dashboard, task list, and task detail views.',
    'completed',
    3
  ),
  (
    'Build responsive dashboard layout',
    'Implement the main dashboard with task statistics, recent activity, and navigation.',
    'in-progress',
    3
  );

-- ============================================
-- VERIFY SEED DATA
-- ============================================

-- Show team members
SELECT id, username, email FROM users ORDER BY id;

-- Show project board overview
SELECT
  t.title,
  t.status,
  u.username AS assigned_to
FROM tasks t
JOIN users u ON t.user_id = u.id
ORDER BY
  CASE t.status
    WHEN 'in-progress' THEN 1
    WHEN 'pending' THEN 2
    WHEN 'completed' THEN 3
  END;
