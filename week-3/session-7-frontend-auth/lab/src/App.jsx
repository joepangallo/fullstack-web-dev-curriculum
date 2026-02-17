/**
 * =============================================================
 * APP COMPONENT - Main Application Router
 * =============================================================
 *
 * This component defines the application's route structure.
 * It uses React Router v6 to map URL paths to page components.
 *
 * ROUTE TYPES:
 *   - Public routes: /login, /register - anyone can access these
 *   - Protected routes: /dashboard - requires authentication
 *
 * KEY CONCEPTS:
 *   - <Routes> is a container for all <Route> definitions
 *   - <Route path="..." element={...} /> maps a URL to a component
 *   - PrivateRoute wraps protected pages to enforce authentication
 *   - The Header component appears on every page (outside Routes)
 *
 * ROUTE STRUCTURE:
 *   /           -> Redirects to /dashboard
 *   /login      -> LoginPage (public)
 *   /register   -> RegisterPage (public)
 *   /dashboard  -> DashboardPage (protected - requires login)
 * =============================================================
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div className="app">
      {/* Header renders on every page - it reads auth state internally */}
      <Header />

      {/* Main content area where routed pages render */}
      <main className="main-content">
        <Routes>
          {/*
            Navigate component performs a redirect.
            When someone visits "/", they go to "/dashboard".
            "replace" prevents the redirect from adding to browser history.
          */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public routes - accessible without authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/*
            Protected route - PrivateRoute checks if user is logged in.
            If not authenticated, it redirects to /login.
            If authenticated, it renders the child component (DashboardPage).
          */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
