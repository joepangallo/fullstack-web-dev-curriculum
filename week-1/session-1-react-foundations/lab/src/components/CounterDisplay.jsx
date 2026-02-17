/**
 * CounterDisplay.jsx - Interactive Counter Component
 * ----------------------------------------------------
 * This component demonstrates two of React's most important concepts:
 *   1. Props — receiving data from a parent component
 *   2. State — managing data that changes over time WITHIN a component
 *
 * Key Concepts:
 *
 *   useState Hook:
 *     const [value, setValue] = useState(initialValue);
 *     - `value` is the current state (read it like a variable)
 *     - `setValue` is the function to UPDATE state (never modify `value` directly!)
 *     - `initialValue` is what `value` starts as (only used on first render)
 *     - When you call setValue(), React RE-RENDERS this component with the new value
 *
 *   Event Handlers:
 *     onClick={() => handleIncrement()}
 *     - We pass a FUNCTION to onClick, not a function CALL
 *     - Wrong: onClick={handleIncrement()} — this would run immediately!
 *     - Right: onClick={handleIncrement} or onClick={() => handleIncrement()}
 *
 *   Why State Matters:
 *     Regular variables reset every render. State PERSISTS between renders.
 *     let count = 0; count++ — this would reset to 0 every time React re-renders!
 *     useState keeps track of the value across renders.
 */
import { useState } from 'react';

function CounterDisplay({ startValue }) {
  // Declare a piece of state called `count`, initialized to whatever `startValue` prop was passed
  // Destructuring: useState returns an array [currentValue, setterFunction]
  const [count, setCount] = useState(startValue);

  /**
   * Increment the counter by 1.
   * We use the FUNCTIONAL form of setState: setCount(prev => prev + 1)
   * This is safer than setCount(count + 1) because it always uses
   * the latest value, even if multiple updates happen quickly.
   */
  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  /**
   * Decrement the counter by 1.
   * Same pattern as increment, but subtracting.
   */
  const handleDecrement = () => {
    setCount((prevCount) => prevCount - 1);
  };

  /**
   * Reset back to the original startValue prop.
   * This shows how props and state can work together —
   * the prop provides the "default" and state tracks changes.
   */
  const handleReset = () => {
    setCount(startValue);
  };

  return (
    <div className="counter-card">
      <h3>Counter (started at {startValue})</h3>

      {/* Display the current count — this updates automatically when state changes */}
      <p className="counter-value">{count}</p>

      <div className="counter-buttons">
        {/*
          Each button has an onClick handler.
          When clicked, it calls the handler function, which calls setCount,
          which triggers a re-render with the new count value.
        */}
        <button onClick={handleDecrement} className="btn btn-decrement">
          - Decrement
        </button>
        <button onClick={handleReset} className="btn btn-reset">
          Reset
        </button>
        <button onClick={handleIncrement} className="btn btn-increment">
          + Increment
        </button>
      </div>
    </div>
  );
}

export default CounterDisplay;
