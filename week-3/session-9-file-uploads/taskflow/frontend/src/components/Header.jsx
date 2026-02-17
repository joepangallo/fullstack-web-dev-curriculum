/**
 * =============================================================
 * HEADER - Updated with Profile Link
 * =============================================================
 *
 * Session 9 adds a "Profile" nav link for authenticated users.
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
        <Link to="/" className="header-logo">TaskFlow</Link>

        <nav className="header-nav">
          {user ? (
            <>
              <NavLink
                to="/tasks"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                My Tasks
              </NavLink>

              {/* NEW: Profile page link */}
              <NavLink
                to="/profile"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Profile
              </NavLink>

              <span className="nav-user">{user.username}</span>
              <button onClick={handleLogout} className="btn btn-logout">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
