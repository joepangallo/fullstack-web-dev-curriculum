/**
 * =============================================================
 * TASKFLOW - DASHBOARD PAGE
 * =============================================================
 *
 * User dashboard showing account info and task statistics.
 * The task stats are placeholders that will be connected
 * to real data in Session 8.
 * =============================================================
 */

import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1>Welcome, {user.username}!</h1>

        <div className="dashboard-info">
          <div className="user-details">
            <h3>Account Details</h3>
            <ul>
              <li><strong>Username:</strong> {user.username}</li>
              <li><strong>Email:</strong> {user.email}</li>
            </ul>
          </div>

          {/* Placeholder task stats - will be real data in Session 8 */}
          <div className="dashboard-placeholder">
            <h3>Task Statistics</h3>
            <p>
              Task statistics will appear here once the backend
              integration is complete in Session 8.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
