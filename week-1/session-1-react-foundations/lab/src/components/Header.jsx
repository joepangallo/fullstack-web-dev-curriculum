/**
 * Header.jsx - Application Header Component
 * -------------------------------------------
 * A simple, reusable header component.
 *
 * Key Concepts:
 *   1. Functional Components — In modern React, components are just functions
 *      that return JSX (the HTML-like syntax). No classes needed!
 *
 *   2. JSX — Looks like HTML but it's actually JavaScript. Key differences:
 *      - Use `className` instead of `class` (because `class` is a JS keyword)
 *      - All tags must be closed: <img /> not <img>
 *      - Use curly braces {} to embed JavaScript expressions
 *
 *   3. This component takes NO props — it's entirely self-contained.
 *      Not every component needs props. Simple, static UI can just return JSX.
 */
function Header() {
  return (
    <header className="app-header">
      <h1>Counter Lab</h1>
      <nav className="nav-placeholder">
        {/* Navigation placeholder — we'll add real routing in Session 2! */}
        <span>Home</span>
        <span>About</span>
        <span>Contact</span>
      </nav>
    </header>
  );
}

export default Header;
