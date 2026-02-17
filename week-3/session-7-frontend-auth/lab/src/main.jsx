/**
 * =============================================================
 * APPLICATION ENTRY POINT (main.jsx)
 * =============================================================
 *
 * This is where React bootstraps the application. We wrap our
 * App component with two key providers:
 *
 * 1. BrowserRouter - Enables client-side routing (URL-based navigation
 *    without full page reloads). This must wrap any component that
 *    uses useNavigate, Link, or Route.
 *
 * 2. AuthProvider - Our custom context provider that makes
 *    authentication state (user, token, login/logout functions)
 *    available to every component in the tree.
 *
 * PROVIDER ORDER MATTERS:
 *   BrowserRouter must be outside AuthProvider because AuthProvider
 *   may use useNavigate() internally (or its children will).
 *
 * REACT 18 PATTERN:
 *   createRoot replaces the older ReactDOM.render() method.
 *   StrictMode enables additional development checks.
 * =============================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './App.css';

// createRoot is the React 18 way to initialize rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // StrictMode helps catch common mistakes during development
  // It renders components twice (dev only) to detect side effects
  <React.StrictMode>
    {/* BrowserRouter provides routing context to all children */}
    <BrowserRouter>
      {/* AuthProvider makes auth state available everywhere */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
