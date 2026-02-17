/**
 * main.jsx - Application Entry Point
 * ------------------------------------
 * This file is the very first JavaScript that runs in our React app.
 *
 * Key Concepts:
 *   1. createRoot() — Creates a React "root" that manages rendering into a DOM node.
 *      This is the React 18+ way of initializing an app (replaces ReactDOM.render).
 *
 *   2. StrictMode — A development-only wrapper that:
 *      - Warns about unsafe lifecycle methods
 *      - Detects unexpected side effects (renders components twice in dev)
 *      - Helps you find bugs early — it does NOT affect production builds
 *
 *   3. We import our CSS here so it applies globally to the entire app.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';

// Find the <div id="root"> in index.html and create a React root inside it
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Render our App component wrapped in StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
