/**
 * main.jsx - Application Entry Point with Router
 * -------------------------------------------------
 * New in Session 2: We wrap our App in BrowserRouter!
 *
 * Key Concept:
 *   BrowserRouter — Provides routing context to the entire application.
 *   It uses the browser's History API (pushState, popState) to keep the URL
 *   in sync with what's displayed on screen, WITHOUT full page reloads.
 *
 *   This is what makes React a "Single Page Application" (SPA):
 *   - The HTML page loads ONCE
 *   - Navigation between "pages" just swaps which components are rendered
 *   - The URL updates but the browser never actually navigates to a new page
 *
 *   BrowserRouter MUST wrap any component that uses React Router features
 *   (Routes, Route, Link, useNavigate, etc.)
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* BrowserRouter wraps the entire app to enable client-side routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
