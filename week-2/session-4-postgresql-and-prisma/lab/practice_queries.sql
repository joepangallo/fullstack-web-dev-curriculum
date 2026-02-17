-- ============================================
-- Session 4 Lab: Practice SQL Queries
-- ============================================
-- Work through these 10 queries to build your SQL skills.
-- Each query demonstrates a different SQL concept.
-- Try running them one at a time and observe the results!
--
-- To run interactively: psql -U your_username -d webdev_db
-- Then paste each query and press Enter.
-- ============================================


-- ============================================
-- QUERY 1: SELECT ALL
-- ============================================
-- The most basic query: retrieve every row and every column from a table.
-- The asterisk (*) means "all columns."

SELECT * FROM users;


-- ============================================
-- QUERY 2: SELECT SPECIFIC COLUMNS
-- ============================================
-- Instead of *, list only the columns you need.
-- This is better for performance and security (e.g., don't expose password_hash).

SELECT id, username, email, created_at
FROM users;


-- ============================================
-- QUERY 3: WHERE CLAUSE (Filtering)
-- ============================================
-- WHERE filters rows based on a condition.
-- Only rows where the condition is true are returned.

SELECT id, title, status
FROM tasks
WHERE status = 'pending';


-- ============================================
-- QUERY 4: WHERE with Multiple Conditions
-- ============================================
-- Use AND / OR to combine conditions.
-- This finds tasks that are either pending or in-progress for user 1.

SELECT id, title, status
FROM tasks
WHERE user_id = 1
  AND (status = 'pending' OR status = 'in-progress');


-- ============================================
-- QUERY 5: JOIN (Combining Tables)
-- ============================================
-- JOIN connects rows from two tables based on a relationship.
-- Here we match tasks.user_id with users.id to see who owns each task.
-- This is one of the most powerful SQL features!

SELECT
  tasks.id AS task_id,
  tasks.title,
  tasks.status,
  users.username AS assigned_to,
  users.email
FROM tasks
JOIN users ON tasks.user_id = users.id;


-- ============================================
-- QUERY 6: ORDER BY (Sorting)
-- ============================================
-- ORDER BY sorts results by one or more columns.
-- ASC = ascending (A-Z, 1-9) - this is the default
-- DESC = descending (Z-A, 9-1)

SELECT id, title, status, created_at
FROM tasks
ORDER BY created_at DESC;  -- Newest tasks first


-- ============================================
-- QUERY 7: COUNT and GROUP BY (Aggregation)
-- ============================================
-- COUNT() counts the number of rows.
-- GROUP BY groups rows with the same value, so COUNT applies per group.
-- This shows how many tasks each user has.

SELECT
  users.username,
  COUNT(tasks.id) AS task_count
FROM users
LEFT JOIN tasks ON users.id = tasks.user_id
GROUP BY users.username
ORDER BY task_count DESC;

-- NOTE: We use LEFT JOIN (not JOIN) so users with 0 tasks still appear.


-- ============================================
-- QUERY 8: COUNT by Status
-- ============================================
-- Another GROUP BY example: count tasks by their status.
-- This gives a quick overview of project progress.

SELECT
  status,
  COUNT(*) AS count
FROM tasks
GROUP BY status
ORDER BY count DESC;


-- ============================================
-- QUERY 9: UPDATE (Modifying Data)
-- ============================================
-- UPDATE changes existing rows. Always use WHERE to target specific rows!
-- Without WHERE, UPDATE changes EVERY row in the table (dangerous!).

-- Mark a specific task as completed:
UPDATE tasks
SET
  status = 'completed',
  updated_at = NOW()          -- Record when the change happened
WHERE id = 2;

-- Verify the update:
SELECT id, title, status, updated_at
FROM tasks
WHERE id = 2;


-- ============================================
-- QUERY 10: DELETE (Removing Data)
-- ============================================
-- DELETE removes rows from a table. Like UPDATE, always use WHERE!
-- Without WHERE, DELETE removes ALL rows (very dangerous!).

-- First, let's see what we're about to delete:
SELECT id, title FROM tasks WHERE id = 6;

-- Delete the task:
DELETE FROM tasks
WHERE id = 6;

-- Verify it's gone:
SELECT id, title FROM tasks ORDER BY id;

-- ============================================
-- BONUS: LIKE (Pattern Matching)
-- ============================================
-- LIKE searches for patterns in text.
-- % = matches any sequence of characters
-- _ = matches exactly one character

SELECT id, title
FROM tasks
WHERE title LIKE '%SQL%';    -- Find tasks mentioning "SQL"

SELECT id, title
FROM tasks
WHERE title LIKE 'Learn%';   -- Find tasks starting with "Learn"
