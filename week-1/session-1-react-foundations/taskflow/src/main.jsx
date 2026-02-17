/**
 * main.jsx - TaskFlow Entry Point
 * ---------------------------------
 * Initializes the React application and mounts it to the DOM.
 * Same pattern as the lab — this is the standard Vite + React setup.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
