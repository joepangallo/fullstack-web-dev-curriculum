// ============================================
// Session 5 Lab: Task Routes (CRUD Operations)
// ============================================
// This file defines all the API endpoints for managing tasks.
// Each route uses Prisma to interact with the PostgreSQL database.
//
// CRUD = Create, Read, Update, Delete
// These are the four basic database operations, and they map to
// HTTP methods like this:
//   Create -> POST
//   Read   -> GET
//   Update -> PUT (or PATCH)
//   Delete -> DELETE
//
// Route summary:
//   GET    /api/tasks      - Get all tasks
//   GET    /api/tasks/:id  - Get one task by ID
//   POST   /api/tasks      - Create a new task
//   PUT    /api/tasks/:id  - Update an existing task
//   DELETE /api/tasks/:id  - Delete a task
// ============================================

const express = require('express');
const router = express.Router();

// Import the shared Prisma client
const { prisma } = require('../prisma');

// Import validation middleware
const { validateTask } = require('../middleware/validate');

// ============================================
// GET /api/tasks - Retrieve all tasks
// ============================================
// Returns an array of all tasks, with basic user info included.
// The 'include' option tells Prisma to JOIN the users table
// and return selected user fields alongside each task.

router.get('/', async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      // Include related user data with each task
      include: {
        user: {
          select: {
            id: true,        // Include user's ID
            username: true,  // Include user's username
            // We intentionally exclude email, passwordHash, etc.
            // Only send what the client needs!
          },
        },
      },
      // Sort by newest first
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 200 OK - successful request
    res.json(tasks);
  } catch (error) {
    // Pass errors to the error handler middleware
    next(error);
  }
});

// ============================================
// GET /api/tasks/:id - Retrieve a single task
// ============================================
// The :id in the URL is a "route parameter."
// If someone requests GET /api/tasks/5, then req.params.id = "5"
// Note: URL params are always strings, so we parse to integer.

router.get('/:id', async (req, res, next) => {
  try {
    // Parse the ID from the URL parameter
    const id = parseInt(req.params.id);

    // Validate that the ID is a valid number
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID. Must be a number.' });
    }

    // findUnique returns one record or null
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    // If no task found, return 404
    if (!task) {
      return res.status(404).json({ error: `Task with ID ${id} not found.` });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// ============================================
// POST /api/tasks - Create a new task
// ============================================
// The client sends task data in the request body (JSON).
// validateTask middleware runs BEFORE this handler to check the data.
// If validation fails, this handler never executes.

router.post('/', validateTask, async (req, res, next) => {
  try {
    const { title, description, status, userId } = req.body;

    // Create the task in the database
    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),               // Remove whitespace from ends
        description: description || null,   // Optional field
        status: status || 'pending',        // Default to 'pending'
        userId,                             // Link to the user
      },
      // Include user data in the response
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    // 201 Created - a new resource was successfully created
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// ============================================
// PUT /api/tasks/:id - Update an existing task
// ============================================
// PUT replaces the resource with new data.
// We only update the fields that were provided in the request body.

router.put('/:id', validateTask, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID. Must be a number.' });
    }

    const { title, description, status, userId } = req.body;

    // Build the update data object with only provided fields
    // This way, fields not included in the request stay unchanged
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (userId !== undefined) updateData.userId = userId;

    // Update the task in the database
    // Prisma throws P2025 if the ID doesn't exist
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json(updatedTask);
  } catch (error) {
    // Handle "record not found" specifically
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Task with ID ${req.params.id} not found.` });
    }
    next(error);
  }
});

// ============================================
// DELETE /api/tasks/:id - Delete a task
// ============================================
// Permanently removes a task from the database.
// Returns 204 No Content on success (no response body needed).

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID. Must be a number.' });
    }

    // Delete the task - Prisma throws P2025 if not found
    await prisma.task.delete({
      where: { id },
    });

    // 204 No Content - successfully deleted, nothing to return
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Task with ID ${req.params.id} not found.` });
    }
    next(error);
  }
});

module.exports = router;
