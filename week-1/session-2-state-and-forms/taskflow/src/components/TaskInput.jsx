/**
 * TaskInput.jsx - Task Creation Form
 * ------------------------------------
 * A controlled form with multiple inputs for creating new tasks.
 *
 * Key Concepts:
 *   1. Multiple Controlled Inputs — Each input field gets its own piece of state.
 *      This gives us full control over every field independently.
 *
 *   2. Form Validation — We check that required fields are filled in before
 *      allowing submission. The submit button is disabled until validation passes.
 *
 *   3. Form Reset — After successful submission, all fields are cleared by
 *      resetting each piece of state to its initial value.
 *
 *   4. Preventing Default — e.preventDefault() is ESSENTIAL in React forms.
 *      Without it, the browser would try to submit the form traditionally
 *      (sending an HTTP request and reloading the page).
 */
import { useState } from 'react';

function TaskInput({ onAddTask }) {
  // Each form field has its own state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  /**
   * Validate form fields.
   * Returns an object of field-name: error-message pairs.
   * An empty object means validation passed.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    // Description is optional, but if provided, limit its length
    if (description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    return newErrors;
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload!

    // Run validation
    const formErrors = validateForm();

    // If there are errors, show them and stop
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Validation passed — call parent's callback
    onAddTask(title.trim(), description.trim());

    // Reset form fields
    setTitle('');
    setDescription('');
    setErrors({});
  };

  return (
    <form className="task-input-form" onSubmit={handleSubmit}>
      <h3>Add New Task</h3>

      <div className="form-group">
        <label htmlFor="task-title" className="form-label">
          Title <span className="required">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          className={`form-input ${errors.title ? 'form-input--error' : ''}`}
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            // Clear title error when user starts typing
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: '' }));
            }
          }}
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="task-description" className="form-label">
          Description
        </label>
        <textarea
          id="task-description"
          className={`form-input form-textarea ${errors.description ? 'form-input--error' : ''}`}
          placeholder="Add details about this task..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: '' }));
            }
          }}
          rows={3}
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      <button type="submit" className="btn btn-primary">
        Add Task
      </button>
    </form>
  );
}

export default TaskInput;
