/**
 * =============================================================
 * TASKFLOW - APPLICATION ENTRY POINT
 * =============================================================
 *
 * Bootstraps the TaskFlow app with routing and auth providers.
 * Same pattern as the lab - BrowserRouter wraps AuthProvider
 * which wraps our App component.
 * =============================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
