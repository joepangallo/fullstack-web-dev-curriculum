/**
 * =============================================================
 * TASKFLOW - TASK CARD COMPONENT (Enhanced)
 * =============================================================
 *
 * An enhanced version of the Week 1 TaskCard component.
 * Now includes:
 *   - Status indicator with color coding
 *   - Priority display
 *   - Created date
 *   - Toggle complete / Edit / Delete action buttons
 *
 * PROPS:
 *   task      - The task object { id, title, description, status, priority, createdAt }
 *   onToggle  - Called when toggle complete is clicked
 *   onEdit    - Called when edit is clicked
 *   onDelete  - Called when delete is clicked
 *
 * This is a "presentational" component - it displays data and
 * calls callback props. It doesn't manage its own data or make
 * API calls (that's the parent's job).
 * =============================================================
 */

/**
 * Map status values to display-friendly labels and CSS classes.
 * Using a lookup object is cleaner than a chain of if/else.
 */
const STATUS_CONFIG = {
  pending: { label: 'Pending', className: 'status-pending' },
  in_progress: { label: 'In Progress', className: 'status-in-progress' },
  completed: { label: 'Completed', className: 'status-completed' },
};

const PRIORITY_CONFIG = {
  low: { label: 'Low', className: 'priority-low' },
  medium: { label: 'Medium', className: 'priority-medium' },
  high: { label: 'High', className: 'priority-high' },
};

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  // Look up display config, with fallback for unknown values
  const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  // Format the creation date for display
  const createdDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString()
    : '';

  // Determine if the task is completed (affects styling)
  const isCompleted = task.status === 'completed';

  return (
    <div className={`task-card ${isCompleted ? 'task-completed' : ''}`}>
      {/* Card header with status badge */}
      <div className="task-card-header">
        <span className={`task-status ${statusConfig.className}`}>
          {statusConfig.label}
        </span>
        <span className={`task-priority ${priorityConfig.className}`}>
          {priorityConfig.label}
        </span>
      </div>

      {/* Task content */}
      <div className="task-card-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        {createdDate && (
          <span className="task-date">Created: {createdDate}</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="task-card-actions">
        <button
          onClick={() => onToggle(task)}
          className="btn btn-sm btn-toggle"
          title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {isCompleted ? 'Undo' : 'Complete'}
        </button>

        <button
          onClick={() => onEdit(task)}
          className="btn btn-sm btn-edit"
          title="Edit task"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="btn btn-sm btn-delete"
          title="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
