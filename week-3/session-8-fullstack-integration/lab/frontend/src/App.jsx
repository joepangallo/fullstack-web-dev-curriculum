/**
 * =============================================================
 * APP COMPONENT - Full-Stack Routing
 * =============================================================
 *
 * Enhanced from Session 7 with the tasks route now pointing
 * to a fully functional TasksPage that connects to the backend.
 *
 * ROUTES:
 *   /           -> Redirect to /tasks
 *   /login      -> LoginPage (public)
 *   /register   -> RegisterPage (public)
 *   /tasks      -> TasksPage (protected, full CRUD)
 * =============================================================
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';

function App() {
  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected route - Tasks page with full API integration */}
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TasksPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
