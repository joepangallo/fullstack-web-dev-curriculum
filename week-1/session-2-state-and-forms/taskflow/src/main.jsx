/**
 * main.jsx - TaskFlow Entry Point with Router
 * ---------------------------------------------
 * BrowserRouter wraps the entire app to enable client-side routing.
 * Without this wrapper, components like Link, Routes, and Route won't work.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
