/**
 * Header.jsx - TaskFlow Header with Navigation Links
 * ----------------------------------------------------
 * Updated from Session 1: now uses React Router's Link component
 * instead of plain <span> elements for real client-side navigation.
 *
 * Key Concept:
 *   Link vs <a> — Both render clickable text, but:
 *     <a href="/tasks">     — Full page reload (browser requests new HTML from server)
 *     <Link to="/tasks">    — Client-side navigation (React swaps components, no reload)
 *
 *   Link is MUCH faster because it only updates what changed on the page.
 *   The browser URL still updates, and back/forward buttons still work.
 */
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="app-header">
      <Link to="/" className="header-brand">
        <h1>TaskFlow</h1>
      </Link>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/tasks" className="nav-link">Tasks</Link>
      </nav>
    </header>
  );
}

export default Header;
