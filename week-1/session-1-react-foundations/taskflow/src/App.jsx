/**
 * App.jsx - TaskFlow Root Component
 * -----------------------------------
 * This component demonstrates passing MULTIPLE props to child components.
 *
 * Key Concepts:
 *   1. Multiple Props — Components can accept any number of props.
 *      Each TaskCard receives title, status, and description.
 *
 *   2. Data-Driven UI — The task data could come from an API (we'll do that in Session 3!).
 *      For now, we define it right here. Notice how each TaskCard gets different data
 *      but renders with the same structure — that's the power of reusable components.
 *
 *   3. Component Tree — App -> Header, TaskCards, Footer
 *      The App component is the "orchestrator" that decides what gets rendered and
 *      what data each child receives.
 */
import Header from './components/Header.jsx';
import TaskCard from './components/TaskCard.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <h2>My Tasks</h2>

        <div className="task-grid">
          {/*
            Each TaskCard receives different props.
            Props are like function arguments — they customize how the component renders.
          */}
          <TaskCard
            title="Set up development environment"
            status="completed"
            description="Install Node.js, VS Code, and Git. Configure ESLint and Prettier for consistent code formatting."
          />

          <TaskCard
            title="Build TaskFlow UI"
            status="in-progress"
            description="Create React components for the task management interface. Use props to pass data between components."
          />

          <TaskCard
            title="Connect to backend API"
            status="pending"
            description="Integrate the React frontend with an Express.js REST API. Implement fetch calls for CRUD operations."
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
