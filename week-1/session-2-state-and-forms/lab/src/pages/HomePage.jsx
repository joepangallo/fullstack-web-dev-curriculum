/**
 * HomePage.jsx - Welcome/Landing Page
 * -------------------------------------
 * A simple page component that introduces the app and links to the todos page.
 *
 * Key Concept:
 *   Page Components vs UI Components:
 *   - Page components (like this one) represent entire "screens" or "views"
 *   - UI components (like TodoList, AddTodoForm) are reusable building blocks
 *   - Pages are mapped to routes; UI components are used within pages
 *
 *   We organize them in separate folders: /pages and /components
 */
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      <h2>Welcome to Todo Lab!</h2>
      <p>
        This app demonstrates React state management, controlled forms,
        and client-side routing. Practice adding, completing, and managing todos.
      </p>
      <div className="home-actions">
        {/*
          Link acts like an <a> tag but prevents full page reload.
          It tells React Router to navigate to /todos and render the TodosPage component.
        */}
        <Link to="/todos" className="btn btn-primary">
          Go to Todos
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
