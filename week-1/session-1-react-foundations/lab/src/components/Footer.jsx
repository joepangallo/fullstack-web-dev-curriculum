/**
 * Footer.jsx - Application Footer Component
 * -------------------------------------------
 * Displays a footer with a dynamically computed copyright year.
 *
 * Key Concepts:
 *   1. JavaScript Expressions in JSX — Anything inside {} is evaluated as JavaScript.
 *      Here we use `new Date().getFullYear()` to always show the current year.
 *      This means we never need to manually update the year — it's always correct!
 *
 *   2. Template-like Behavior — JSX lets us mix static text with dynamic values
 *      seamlessly, which is one of the reasons React is so productive.
 */
function Footer() {
  // Get the current year dynamically
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>&copy; {currentYear} Counter Lab. Built with React + Vite.</p>
    </footer>
  );
}

export default Footer;
