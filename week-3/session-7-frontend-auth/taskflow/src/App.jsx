/**
 * =============================================================
 * TASKFLOW - APP COMPONENT
 * =============================================================
 *
 * TaskFlow's route structure includes an additional /tasks route
 * that will display the task management interface (placeholder
 * for now - fully implemented in Session 8).
 *
 * ROUTES:
 *   /           -> Redirect to /tasks
 *   /login      -> LoginPage (public)
 *   /register   -> RegisterPage (public)
 *   /tasks      -> TasksPage (protected)
 *   /dashboard  -> DashboardPage (protected)
 * =============================================================
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';

function App() {
  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <Routes>
          {/* Default route goes to tasks (the main feature) */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TasksPage />
              </PrivateRoute>
            }
          />
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
