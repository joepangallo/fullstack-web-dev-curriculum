/**
 * =============================================================
 * TASKFLOW APP - Updated with Profile Route
 * =============================================================
 *
 * Session 9 adds a /profile route where users can view their
 * account info and upload/change their avatar image.
 *
 * ROUTES:
 *   /           -> Redirect to /tasks
 *   /login      -> LoginPage (public)
 *   /register   -> RegisterPage (public)
 *   /tasks      -> TasksPage (protected)
 *   /profile    -> ProfilePage (protected) -- NEW in Session 9
 * =============================================================
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';

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

          {/* Protected routes */}
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TasksPage />
              </PrivateRoute>
            }
          />

          {/* NEW: Profile page with avatar upload */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
