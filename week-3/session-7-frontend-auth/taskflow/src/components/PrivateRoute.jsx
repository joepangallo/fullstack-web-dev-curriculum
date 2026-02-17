/**
 * =============================================================
 * TASKFLOW - PRIVATE ROUTE
 * =============================================================
 *
 * Protects routes that require authentication.
 * Redirects unauthenticated users to the login page.
 * =============================================================
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading TaskFlow...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}

export default PrivateRoute;
