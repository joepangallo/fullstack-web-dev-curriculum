/**
 * App.jsx - Root Component with Client-Side Routing
 * ---------------------------------------------------
 * This component sets up the application's route structure.
 *
 * Key Concepts:
 *   1. Routes & Route — Define which component renders at which URL path.
 *      <Route path="/" element={<HomePage />} />
 *      means: "When the URL is '/', render the HomePage component."
 *
 *   2. Link vs <a> tag — In React Router, we use <Link> instead of <a> for
 *      internal navigation. <Link> prevents a full page reload and instead
 *      updates the URL and swaps components instantly. Much faster!
 *
 *   3. Layout Pattern — Header and Footer render on EVERY page because
 *      they're outside the <Routes> block. Only the content between
 *      <Routes>...</Routes> changes based on the URL.
 */
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import TodosPage from './pages/TodosPage.jsx';

function App() {
  return (
    <div className="app">
      {/* Header with navigation — renders on every page */}
      <header className="app-header">
        <h1>Todo Lab</h1>
        <nav className="nav-links">
          {/*
            Link components — these handle navigation WITHOUT page reloads.
            The `to` prop specifies which route to navigate to.
            Under the hood, Link renders an <a> tag but intercepts the click event.
          */}
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/todos" className="nav-link">Todos</Link>
        </nav>
      </header>

      {/*
        Routes — Only ONE Route matches at a time.
        React Router checks the current URL against each Route's `path`
        and renders the matching `element`.
      */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/todos" element={<TodosPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Todo Lab. Built with React + React Router.</p>
      </footer>
    </div>
  );
}

export default App;
