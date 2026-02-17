/**
 * =============================================================
 * TASK INPUT COMPONENT - Create & Edit Task Form
 * =============================================================
 *
 * A dual-purpose form that handles both creating new tasks
 * and editing existing ones. The mode is determined by the
 * `editingTask` prop:
 *   - null: Create mode (empty form, "Add Task" button)
 *   - object: Edit mode (pre-filled form, "Update" + "Cancel" buttons)
 *
 * KEY CONCEPTS:
 *   - Controlled form inputs tied to React state
 *   - useEffect to populate form when editing a task
 *   - Form reset after successful submission
 *   - Error display for failed API calls
 *   - Optimistic UI: form clears immediately on success
 *
 * PROPS:
 *   onSubmit      - (taskData) => Promise<{ success, error? }>
 *   editingTask   - Task object to edit, or null for create mode
 *   onCancelEdit  - () => void - Cancel editing
 * =============================================================
 */

import { useState, useEffect } from 'react';

function TaskInput({ onSubmit, editingTask, onCancelEdit }) {
  // Form field state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');

  // UI state
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * When editingTask changes, populate the form with its values.
   *
   * This useEffect watches editingTask - when a user clicks "Edit"
   * on a TaskCard, the parent sets editingTask, and this effect
   * fills in the form fields.
   */
  useEffect(() => {
    if (editingTask) {
      // Edit mode - populate form with task data
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
      setStatus(editingTask.status || 'pending');
    } else {
      // Create mode - clear the form
      resetForm();
    }
  }, [editingTask]);

  /**
   * Reset all form fields to their default values.
   */
  function resetForm() {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('pending');
    setError('');
  }

  /**
   * Handle form submission.
   * Calls the onSubmit prop (which is either create or update handler).
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setIsSubmitting(true);

    // Build the task data object
    const taskData = {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      status,
    };

    try {
      // Call the parent's handler (create or update)
      const result = await onSubmit(taskData);

      if (result.success) {
        // Success - reset the form
        resetForm();
      } else {
        // API returned an error
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="task-input-container">
      <h2 className="task-input-title">
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </h2>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="task-input-form">
        {/* Title input - required */}
        <div className="form-group">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            maxLength={200}
            disabled={isSubmitting}
          />
        </div>

        {/* Description textarea - optional */}
        <div className="form-group">
          <label htmlFor="task-description">Description (optional)</label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {/* Priority and Status in a row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Status select - only shown in edit mode */}
          {editingTask && (
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : editingTask
              ? 'Update Task'
              : 'Add Task'}
          </button>

          {/* Cancel button - only shown in edit mode */}
          {editingTask && (
            <button
              type="button"
              className="btn btn-cancel"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskInput;
