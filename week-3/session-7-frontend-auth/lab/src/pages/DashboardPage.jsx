/**
 * =============================================================
 * DASHBOARD PAGE - Protected User Dashboard
 * =============================================================
 *
 * This page is only accessible to authenticated users.
 * It's wrapped by PrivateRoute which handles the auth check.
 *
 * KEY CONCEPTS:
 *   - Consuming auth context to display user-specific data
 *   - This is a "protected page" - only renders when user is logged in
 *   - Placeholder for future features (tasks, settings, etc.)
 *
 * Since PrivateRoute already verified authentication,
 * we can safely assume `user` is not null here.
 * =============================================================
 */

import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  // Get the current user from auth context
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        {/* Welcome message with the authenticated user's name */}
        <h1>Welcome, {user.username}!</h1>

        <div className="dashboard-info">
          <p>You are successfully logged in.</p>

          {/* Display user details from the JWT payload */}
          <div className="user-details">
            <h3>Your Account Info</h3>
            <ul>
              <li>
                <strong>Username:</strong> {user.username}
              </li>
              <li>
                <strong>Email:</strong> {user.email}
              </li>
              <li>
                <strong>User ID:</strong> {user.id}
              </li>
            </ul>
          </div>

          {/* Placeholder for future features */}
          <div className="dashboard-placeholder">
            <h3>Coming Soon</h3>
            <p>
              This dashboard will be expanded in Session 8 to include
              a full task management interface with CRUD operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
