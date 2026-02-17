/**
 * TodoList.jsx - Todo List with Loading Simulation
 * --------------------------------------------------
 * Displays the list of todos with loading state and empty state handling.
 *
 * Key Concepts:
 *   1. useEffect Hook — Runs side effects (things that happen OUTSIDE of rendering).
 *      Common uses: fetching data, setting up timers, subscribing to events.
 *
 *      useEffect(() => { ... }, [dependencies])
 *      - The function runs AFTER the component renders
 *      - The dependency array controls WHEN it re-runs:
 *        [] (empty) — runs only once, after the FIRST render
 *        [value]    — runs when `value` changes
 *        (omitted)  — runs after EVERY render (usually not what you want!)
 *
 *   2. Conditional Rendering — Showing different UI based on state:
 *      - Loading spinner while "fetching" data
 *      - Empty message when there are no todos
 *      - The actual list when todos exist
 *
 *   3. Lists and Keys — When rendering arrays with .map(), each element needs
 *      a unique `key` prop. React uses keys to efficiently update the DOM.
 *      Keys help React identify which items changed, were added, or removed.
 *      NEVER use array index as a key if the list can be reordered!
 */
import { useState, useEffect } from 'react';

function TodoList({ todos, onToggleTodo, setTodos }) {
  // Track whether we're "loading" data (simulating an API call)
  const [isLoading, setIsLoading] = useState(true);

  /**
   * useEffect with empty dependency array [] — runs ONCE after first render.
   *
   * This simulates what a real API call would look like:
   *   1. Component mounts (first render) — show loading state
   *   2. setTimeout fires after 1 second — simulates network delay
   *   3. "Data arrives" — we update state and hide loading
   *
   * In a real app, you'd use fetch() or axios instead of setTimeout.
   * We'll do that in Session 3 when we connect to Express!
   */
  useEffect(() => {
    // Simulate fetching initial todos from an API
    const timer = setTimeout(() => {
      // These are our "fetched" todos — pretend they came from a server
      const initialTodos = [
        { id: 1, text: 'Learn React components and JSX', completed: true },
        { id: 2, text: 'Understand useState and useEffect', completed: false },
        { id: 3, text: 'Build a form with controlled inputs', completed: false },
      ];

      // Update the parent's state with the "fetched" data
      setTodos(initialTodos);
      setIsLoading(false);
    }, 1000); // 1-second delay to simulate network latency

    /**
     * Cleanup function — runs when the component unmounts.
     * This prevents memory leaks by canceling the timer if the user
     * navigates away before the "fetch" completes.
     */
    return () => clearTimeout(timer);
  }, []); // Empty array = run only once on mount

  // ===== Conditional Rendering =====

  // State 1: Loading
  if (isLoading) {
    return (
      <div className="todo-list-loading">
        <p>Loading todos...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // State 2: Empty list
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>No todos yet! Add one above to get started.</p>
      </div>
    );
  }

  // State 3: Todos exist — render the list
  return (
    <ul className="todo-list">
      {/*
        .map() transforms each todo object into a JSX element.
        This is the React way to render lists — it's like a for loop
        but returns an array of elements.

        The `key` prop is REQUIRED when rendering lists.
        It must be unique among siblings (todo.id works perfectly).
      */}
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`todo-item ${todo.completed ? 'todo-item--completed' : ''}`}
        >
          <span
            className="todo-text"
            onClick={() => onToggleTodo(todo.id)}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              cursor: 'pointer',
            }}
          >
            {todo.text}
          </span>
          <button
            className="btn btn-toggle"
            onClick={() => onToggleTodo(todo.id)}
          >
            {todo.completed ? 'Undo' : 'Complete'}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
