/**
 * Header.jsx - TaskFlow Header
 * ------------------------------
 * The application header with branding and navigation placeholder.
 *
 * Key Concept:
 *   Static Components — Not every component needs props or state.
 *   This header is purely presentational. It always renders the same thing.
 *   That's perfectly fine! Simple components are easy to understand and maintain.
 */
function Header() {
  return (
    <header className="app-header">
      <h1>TaskFlow</h1>
      <nav className="nav-placeholder">
        {/* We'll replace these with real React Router Links in Session 2 */}
        <span>Dashboard</span>
        <span>Tasks</span>
        <span>Settings</span>
      </nav>
    </header>
  );
}

export default Header;
