/**
 * AddTodoForm.jsx - Controlled Form Component
 * ----------------------------------------------
 * A form for adding new todos, demonstrating controlled inputs.
 *
 * Key Concepts:
 *   1. Controlled Inputs — In React, form inputs can be "controlled" by state.
 *      This means:
 *        - The input's value comes FROM state: value={inputValue}
 *        - Changes go TO state: onChange={(e) => setInputValue(e.target.value)}
 *        - React state is the "single source of truth" for the input's value
 *
 *      Why controlled? It gives you full control over the input:
 *        - Validate on every keystroke
 *        - Transform input (uppercase, trim, etc.)
 *        - Enable/disable submit based on input
 *        - Clear the input after submission
 *
 *   2. Form Submission — We handle the form's onSubmit event:
 *        - e.preventDefault() stops the browser from refreshing the page
 *          (HTML forms normally send an HTTP request and reload!)
 *        - We validate the input, then call the parent's callback
 *
 *   3. Callback Props — `onAddTodo` is a function passed from the parent.
 *      When the form submits, we call it with the new todo text.
 *      This is how children communicate UP to parents.
 */
import { useState } from 'react';

function AddTodoForm({ onAddTodo }) {
  // Controlled input state — tracks what the user has typed
  const [inputValue, setInputValue] = useState('');
  // Error state — for validation feedback
  const [error, setError] = useState('');

  /**
   * Form submission handler.
   * This runs when the user clicks "Add Todo" or presses Enter.
   */
  const handleSubmit = (e) => {
    // CRITICAL: Prevent the default HTML form behavior (page reload)
    e.preventDefault();

    // Trim whitespace and validate
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      // Set error message if input is empty
      setError('Please enter a todo item');
      return; // Stop here — don't add an empty todo
    }

    // Validation passed! Call the parent's callback with the new todo text
    onAddTodo(trimmedValue);

    // Reset the form after successful submission
    setInputValue(''); // Clear the input
    setError('');       // Clear any error messages
  };

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className={`form-input ${error ? 'form-input--error' : ''}`}
          placeholder="What needs to be done?"
          /*
           * Controlled input: the value is ALWAYS whatever is in state.
           * The input and state are synchronized — they always match.
           */
          value={inputValue}
          /*
           * onChange fires on every keystroke.
           * e.target.value is the current content of the input field.
           * We update state, which triggers a re-render, which updates the input.
           */
          onChange={(e) => {
            setInputValue(e.target.value);
            // Clear error when user starts typing
            if (error) setError('');
          }}
        />
        <button type="submit" className="btn btn-primary">
          Add Todo
        </button>
      </div>

      {/* Conditional rendering: only show error message if there IS an error */}
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default AddTodoForm;
