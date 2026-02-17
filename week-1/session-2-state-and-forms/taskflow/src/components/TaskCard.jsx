/**
 * TaskCard.jsx - Individual Task Display Component
 * --------------------------------------------------
 * Updated from Session 1: now includes interactive buttons for
 * toggling completion status and deleting tasks.
 *
 * Key Concepts:
 *   1. Callback Props for Actions — `onToggle` and `onDelete` are functions
 *      passed from the parent. When the user clicks a button, we call
 *      the parent's function with the task's ID so the parent can update state.
 *
 *   2. Conditional Content — The toggle button shows different text based on
 *      the task's current status. The card also gets a visual indicator
 *      (strikethrough, opacity) when completed.
 *
 *   3. Multiple Event Handlers — A single component can have many clickable
 *      elements, each with its own handler.
 */
function TaskCard({ id, title, status, description, createdAt, onToggle, onDelete }) {
  /**
   * Format the creation date for display.
   * toLocaleDateString() formats a date according to the user's locale.
   */
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Map status to user-friendly labels
  const statusLabels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };

  const isCompleted = status === 'completed';

  return (
    <div className={`task-card task-card--${status}`}>
      <div className="task-card__header">
        <span className={`status-badge status-badge--${status}`}>
          {statusLabels[status] || status}
        </span>
        <span className="task-card__date">{formattedDate}</span>
      </div>

      <h3
        className="task-card__title"
        style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}
      >
        {title}
      </h3>

      <p className="task-card__description">{description}</p>

      <div className="task-card__actions">
        {/*
          Toggle button — calls the parent's onToggle with this task's ID.
          The parent (TasksPage) will then update the tasks array in state.
        */}
        <button
          className={`btn ${isCompleted ? 'btn-undo' : 'btn-complete'}`}
          onClick={() => onToggle(id)}
        >
          {isCompleted ? 'Mark Pending' : 'Mark Complete'}
        </button>

        {/*
          Delete button — calls the parent's onDelete.
          Notice we use an arrow function to pass the ID:
            onClick={() => onDelete(id)}
          NOT:
            onClick={onDelete(id)}  — This would call it immediately on render!
        */}
        <button
          className="btn btn-delete"
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
