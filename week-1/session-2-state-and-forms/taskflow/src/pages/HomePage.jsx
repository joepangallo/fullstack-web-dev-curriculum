/**
 * HomePage.jsx - TaskFlow Welcome Page
 * --------------------------------------
 * Landing page with a brief description and link to the tasks page.
 */
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      <h2>Welcome to TaskFlow</h2>
      <p>
        Organize your work with TaskFlow. Create tasks, track their status,
        and filter by progress. This session adds state management, forms,
        and client-side routing to the TaskFlow app from Session 1.
      </p>
      <div className="home-actions">
        <Link to="/tasks" className="btn btn-primary">
          View Tasks
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
