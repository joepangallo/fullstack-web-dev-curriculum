/**
 * =============================================================
 * TASK CARD COMPONENT - Individual Task Display
 * =============================================================
 *
 * Displays a single task with its details and action buttons.
 * This is a presentational component that receives all data
 * and callbacks via props.
 *
 * FEATURES:
 *   - Color-coded status and priority badges
 *   - Toggle complete button
 *   - Edit and delete buttons
 *   - Visual distinction for completed tasks (strikethrough + opacity)
 *   - Formatted creation date
 *
 * PROPS:
 *   task     - { id, title, description, status, priority, createdAt }
 *   onToggle - (task) => void - Toggle completion status
 *   onEdit   - (task) => void - Enter edit mode for this task
 *   onDelete - (taskId) => void - Delete this task
 * =============================================================
 */

// Status configuration for display labels and CSS classes
const STATUS_CONFIG = {
  pending: { label: 'Pending', className: 'status-pending' },
  in_progress: { label: 'In Progress', className: 'status-in-progress' },
  completed: { label: 'Completed', className: 'status-completed' },
};

// Priority configuration
const PRIORITY_CONFIG = {
  low: { label: 'Low', className: 'priority-low' },
  medium: { label: 'Medium', className: 'priority-medium' },
  high: { label: 'High', className: 'priority-high' },
};

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  // Look up display configuration with sensible defaults
  const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  // Format the creation date
  const createdDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const isCompleted = task.status === 'completed';

  return (
    <div className={`task-card ${isCompleted ? 'task-completed' : ''}`}>
      {/* Header row with status and priority badges */}
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
        {/*
          Toggle button changes label based on current status.
          Completed tasks show "Undo", others show "Complete".
        */}
        <button
          onClick={() => onToggle(task)}
          className="btn btn-sm btn-toggle"
        >
          {isCompleted ? 'Undo' : 'Complete'}
        </button>

        <button
          onClick={() => onEdit(task)}
          className="btn btn-sm btn-edit"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="btn btn-sm btn-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
