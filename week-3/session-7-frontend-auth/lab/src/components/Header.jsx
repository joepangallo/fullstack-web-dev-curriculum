/**
 * =============================================================
 * HEADER COMPONENT - Auth-Aware Navigation Bar
 * =============================================================
 *
 * The Header adapts its content based on authentication state:
 *   - Logged out: Shows "Login" and "Register" links
 *   - Logged in: Shows username, "Dashboard" link, and "Logout" button
 *
 * KEY CONCEPTS:
 *   - Conditional rendering based on auth state
 *   - useAuth() hook to access user data
 *   - Link vs NavLink: NavLink adds "active" class to current route
 *   - useNavigate for programmatic navigation (after logout)
 *
 * WHY useNavigate INSTEAD OF Link FOR LOGOUT?
 *   Logout is an action, not a navigation. We need to:
 *     1. Call logout() to clear auth state
 *     2. THEN navigate to /login
 *   A <Link> would navigate immediately without running logout().
 * =============================================================
 */

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle logout button click.
   * Clear auth state first, then redirect to login page.
   */
  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="header">
      <div className="header-content">
        {/* App branding - always links to home */}
        <Link to="/" className="header-logo">
          AuthApp
        </Link>

        {/* Navigation - changes based on auth state */}
        <nav className="header-nav">
          {user ? (
            // AUTHENTICATED: Show user info and logout
            <>
              {/*
                NavLink adds an "active" className when the URL
                matches its "to" prop. This lets us style the
                current page's link differently.
              */}
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Dashboard
              </NavLink>

              {/* Display the logged-in username */}
              <span className="nav-user">
                Hello, {user.username}
              </span>

              {/* Logout is a button (action), not a link (navigation) */}
              <button
                onClick={handleLogout}
                className="btn btn-logout"
              >
                Logout
              </button>
            </>
          ) : (
            // NOT AUTHENTICATED: Show login and register links
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
