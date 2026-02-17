/**
 * =============================================================
 * TASKFLOW - HEADER COMPONENT
 * =============================================================
 *
 * TaskFlow-branded navigation header with auth-aware links.
 * Shows different navigation options based on login state:
 *   - Logged out: Login, Register
 *   - Logged in: Tasks, Dashboard, username, Logout
 * =============================================================
 */

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="header">
      <div className="header-content">
        {/* TaskFlow branding */}
        <Link to="/" className="header-logo">
          TaskFlow
        </Link>

        <nav className="header-nav">
          {user ? (
            <>
              {/* Main feature link - Tasks */}
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                My Tasks
              </NavLink>

              {/* Dashboard link */}
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Dashboard
              </NavLink>

              <span className="nav-user">
                {user.username}
              </span>

              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </>
          ) : (
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
