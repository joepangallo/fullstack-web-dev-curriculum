/**
 * App.jsx - Root Application Component
 * --------------------------------------
 * This is the top-level component that composes our entire UI.
 *
 * Key Concepts:
 *   1. Component Composition — Building UIs by combining smaller components.
 *      Think of it like LEGO: small pieces snap together to make something bigger.
 *
 *   2. Props (Properties) — Data passed from a parent component to a child.
 *      Here we pass `startValue` to each CounterDisplay so they begin at different numbers.
 *      Props flow ONE direction: parent -> child (this is called "one-way data flow").
 *
 *   3. Reusable Components — CounterDisplay is used TWICE with different props.
 *      This is the power of components: write once, use many times with different data.
 */
import Header from './components/Header.jsx';
import CounterDisplay from './components/CounterDisplay.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="app">
      {/* Header component — no props needed, it's self-contained */}
      <Header />

      <main className="main-content">
        <h2>Practice with Counters</h2>
        <p className="intro-text">
          Each counter below is an independent component with its own state.
          Try clicking the buttons — notice how one counter does NOT affect the other!
        </p>

        <div className="counters-container">
          {/*
            Two instances of the SAME component, but with DIFFERENT props.
            Each one will manage its own internal state independently.
          */}
          <CounterDisplay startValue={0} />
          <CounterDisplay startValue={10} />
        </div>
      </main>

      {/* Footer component — also self-contained */}
      <Footer />
    </div>
  );
}

// Default export — this is what gets imported when someone writes:
//   import App from './App.jsx'
export default App;
