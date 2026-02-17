/**
 * =============================================================
 * HEADER COMPONENT - Auth-Aware Navigation
 * =============================================================
 *
 * Displays different navigation based on auth state:
 *   - Logged out: Login, Register links
 *   - Logged in: My Tasks link, username, Logout button
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
        <Link to="/" className="header-logo">
          TaskFlow
        </Link>

        <nav className="header-nav">
          {user ? (
            <>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                My Tasks
              </NavLink>

              <span className="nav-user">{user.username}</span>

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
