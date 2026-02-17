/**
 * Footer.jsx - TaskFlow Footer
 * ------------------------------
 * Displays copyright information with a dynamically computed year.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>&copy; {currentYear} TaskFlow. Built with React + Vite.</p>
    </footer>
  );
}

export default Footer;
