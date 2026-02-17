/**
 * app.js - Express Server Entry Point
 * =====================================
 * This file sets up and starts an Express.js REST API server.
 *
 * What is Express?
 *   Express is a minimal, flexible Node.js web framework.
 *   It provides a simple way to:
 *     - Listen for HTTP requests (GET, POST, PUT, DELETE)
 *     - Parse request data (JSON bodies, URL parameters)
 *     - Send HTTP responses (JSON data, status codes)
 *     - Use middleware (functions that run before route handlers)
 *
 * What is a REST API?
 *   REST (Representational State Transfer) is a pattern for building web APIs.
 *   It maps HTTP methods to CRUD operations:
 *     GET    = Read    (fetch data)
 *     POST   = Create  (add new data)
 *     PUT    = Update  (modify existing data)
 *     DELETE = Delete  (remove data)
 *
 * What is Middleware?
 *   Middleware functions run BETWEEN receiving a request and sending a response.
 *   They can:
 *     - Parse data (express.json() parses JSON request bodies)
 *     - Log requests (our custom logger)
 *     - Check permissions (authentication middleware)
 *     - Handle errors (error handler middleware)
 *   Middleware is executed in ORDER — the order you call app.use() matters!
 */

// ===== Load Environment Variables =====
// dotenv reads the .env file and makes its values available via process.env
// This MUST happen before we access any process.env values
const dotenv = require('dotenv');
dotenv.config();

// ===== Import Dependencies =====
const express = require('express');
const cors = require('cors');

// Import our custom middleware
const logger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// ===== Create the Express Application =====
// express() creates a new Express app — this is the foundation of our server
const app = express();

// Read the PORT from environment variables, fallback to 3000 if not set
const PORT = process.env.PORT || 3000;

// ===== Register Middleware (ORDER MATTERS!) =====

/**
 * express.json() — Built-in middleware that parses JSON request bodies.
 * Without this, req.body would be undefined when clients send JSON data.
 * This MUST come before route handlers that need to read req.body.
 */
app.use(express.json());

/**
 * cors() — Cross-Origin Resource Sharing middleware.
 * By default, browsers block requests from one domain to another (security).
 * CORS headers tell the browser "it's ok, allow this request."
 * In development, our React app (port 5173) calls our API (port 3000) —
 * that's cross-origin, so we need CORS.
 */
app.use(cors());

/**
 * Custom logger middleware — logs every request's method, path, and timestamp.
 * This runs for EVERY request because we registered it before our routes.
 */
app.use(logger);

// ===== In-Memory Data Store =====
/**
 * For now, we store data in a plain JavaScript array.
 * This is fine for learning, but data is lost when the server restarts!
 * In Sessions 4+, we'll replace this with a real database (PostgreSQL).
 *
 * Each item has: id, name, description
 */
let items = [
  { id: 1, name: 'Laptop', description: 'MacBook Pro 14-inch with M3 chip' },
  { id: 2, name: 'Keyboard', description: 'Mechanical keyboard with Cherry MX switches' },
  { id: 3, name: 'Monitor', description: '27-inch 4K IPS display' },
];

// ===== API Routes =====

/**
 * GET /api/items — Retrieve ALL items
 *
 * HTTP Method: GET (reading data, no side effects)
 * Response: 200 OK with JSON array of all items
 *
 * This is the simplest route: get everything and send it back.
 * In a real app, you'd add pagination (limit/offset) for large datasets.
 */
app.get('/api/items', (req, res) => {
  // res.json() sets Content-Type to application/json and sends the data
  res.json(items);
});

/**
 * GET /api/items/:id — Retrieve a SINGLE item by ID
 *
 * The :id in the path is a "route parameter" — a variable part of the URL.
 * If the client requests /api/items/2, then req.params.id is "2".
 * Note: Route params are always STRINGS, so we convert to a number.
 *
 * We need to handle the case where the item doesn't exist (404 Not Found).
 */
app.get('/api/items/:id', (req, res) => {
  // req.params contains route parameters (the :id part of the URL)
  // parseInt converts the string "2" to the number 2
  const id = parseInt(req.params.id, 10);

  // .find() returns the first item where the callback returns true, or undefined
  const item = items.find((item) => item.id === id);

  if (!item) {
    // 404 Not Found — the requested resource doesn't exist
    return res.status(404).json({ error: `Item with id ${id} not found` });
  }

  // 200 OK (default) — send the found item
  res.json(item);
});

/**
 * POST /api/items — Create a NEW item
 *
 * HTTP Method: POST (creating new data)
 * Request Body: { "name": "...", "description": "..." }
 * Response: 201 Created with the new item (including its generated ID)
 *
 * We validate that the required field (name) is present.
 * express.json() middleware already parsed the JSON body into req.body.
 */
app.post('/api/items', (req, res) => {
  // Destructure the fields we expect from the request body
  const { name, description } = req.body;

  // Validation: name is required
  if (!name || !name.trim()) {
    // 400 Bad Request — the client sent invalid data
    return res.status(400).json({ error: 'Name is required' });
  }

  // Create the new item with a generated ID
  const newItem = {
    id: Date.now(),                               // Simple unique ID using timestamp
    name: name.trim(),                            // Trim whitespace
    description: description ? description.trim() : '',
  };

  // Add to our in-memory array
  items.push(newItem);

  // 201 Created — new resource was successfully created
  // Convention: return the created resource so the client knows the full object (including ID)
  res.status(201).json(newItem);
});

/**
 * PUT /api/items/:id — Update an EXISTING item
 *
 * HTTP Method: PUT (replacing/updating existing data)
 * The client sends the updated fields in the request body.
 * We find the item by ID and merge the updates.
 *
 * PUT vs PATCH:
 *   PUT traditionally replaces the ENTIRE resource
 *   PATCH updates only the specified fields
 *   In practice, many APIs use PUT for partial updates too (like we do here)
 */
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description } = req.body;

  // Find the INDEX of the item (we need it to update the array)
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    // -1 means .findIndex() didn't find a match
    return res.status(404).json({ error: `Item with id ${id} not found` });
  }

  // Update the item — spread the existing item and override with new values
  // Only override if the new value was actually provided (not undefined)
  items[index] = {
    ...items[index],                                  // Keep existing properties
    name: name !== undefined ? name.trim() : items[index].name,
    description: description !== undefined ? description.trim() : items[index].description,
  };

  // 200 OK — send back the updated item
  res.json(items[index]);
});

/**
 * DELETE /api/items/:id — Remove an item
 *
 * HTTP Method: DELETE (removing data)
 * Response: 204 No Content — success, but no data to send back.
 *
 * 204 is the standard response for successful deletes.
 * The client already knows what was deleted (they sent the ID).
 */
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  // Check if the item exists before trying to delete
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Item with id ${id} not found` });
  }

  // .splice(index, 1) removes 1 element at the given index
  items.splice(index, 1);

  // 204 No Content — successful deletion, nothing to send back
  // .send() without arguments sends an empty response body
  res.status(204).send();
});

// ===== Error Handling (MUST be AFTER all routes) =====

/**
 * 404 Handler — catches any request that didn't match a route above.
 * This MUST be after all app.get/post/put/delete routes.
 */
app.use(notFoundHandler);

/**
 * Global Error Handler — catches any errors thrown in route handlers.
 * Express identifies this as an error handler because it has 4 parameters.
 * This MUST be the very last middleware registered.
 */
app.use(errorHandler);

// ===== Start the Server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Try: GET http://localhost:${PORT}/api/items`);
});
