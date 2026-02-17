/**
 * App.jsx - TaskFlow Root with Routing
 * --------------------------------------
 * Sets up the application layout with Header, Footer, and route-based content.
 *
 * Key Concept:
 *   Layout Pattern — Header and Footer render on EVERY page because they live
 *   outside <Routes>. Only the section inside <Routes> swaps based on the URL.
 */
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import TasksPage from './pages/TasksPage.jsx';

function App() {
  return (
    <div className="app">
      {/* Header with navigation Links — always visible */}
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
