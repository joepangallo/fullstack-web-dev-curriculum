/**
 * =============================================================
 * PRIVATE ROUTE - Route Guard Component
 * =============================================================
 *
 * This component protects routes that require authentication.
 * It checks if the user is logged in before rendering the
 * protected content. If not authenticated, it redirects to /login.
 *
 * PATTERN: Higher-Order Component (HOC) / Wrapper Component
 *   <PrivateRoute>
 *     <DashboardPage />    <- Only renders if user is logged in
 *   </PrivateRoute>
 *
 * THREE STATES:
 *   1. isLoading: Show nothing (or a spinner) while checking auth
 *   2. Authenticated: Render the children (protected page)
 *   3. Not authenticated: Redirect to /login
 *
 * WHY CHECK isLoading?
 *   On page refresh, AuthProvider reads the token from localStorage.
 *   This takes a moment. Without the loading check, we'd briefly
 *   redirect to /login before the token is validated, causing a
 *   flash of the login page.
 *
 * Navigate's "state" prop:
 *   We pass the current location so that after login, we can
 *   redirect the user back to where they were trying to go.
 * =============================================================
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  // Get auth state from context
  const { user, isLoading } = useAuth();

  // Get current location for redirect-after-login
  const location = useLocation();

  // State 1: Still checking if user has a valid stored token
  // Show a loading indicator to prevent flash of login page
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // State 2: No authenticated user - redirect to login
  // We pass the attempted URL in state so LoginPage can redirect back
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace // Don't add the redirect to browser history
      />
    );
  }

  // State 3: User is authenticated - render the protected content
  return children;
}

export default PrivateRoute;
