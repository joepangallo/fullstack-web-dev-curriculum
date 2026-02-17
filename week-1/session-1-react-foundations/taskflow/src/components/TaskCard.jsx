/**
 * TaskCard.jsx - Task Display Component
 * ---------------------------------------
 * Displays a single task with its title, status, and description.
 *
 * Key Concepts:
 *   1. Destructuring Props — Instead of writing `function TaskCard(props)` and
 *      accessing `props.title`, we destructure directly in the parameter:
 *        function TaskCard({ title, status, description })
 *      This is cleaner and makes it immediately obvious what props the component expects.
 *
 *   2. Conditional CSS Classes — We dynamically choose a CSS class based on the
 *      `status` prop using template literals. This is a common React pattern for
 *      styling components differently based on their data.
 *
 *   3. Computed Values — `statusLabel` maps status codes to human-friendly text.
 *      Doing this computation INSIDE the component keeps the logic close to where
 *      it's used, making it easier to understand and maintain.
 */
function TaskCard({ title, status, description }) {
  /**
   * Map status values to user-friendly labels.
   * This is a common pattern: the data layer uses simple strings like "in-progress",
   * but the UI displays something nicer like "In Progress".
   */
  const statusLabels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };

  // Look up the label, or fall back to the raw status if unknown
  const statusLabel = statusLabels[status] || status;

  return (
    <div className={`task-card task-card--${status}`}>
      {/* Status badge — styled differently based on the status */}
      <span className={`status-badge status-badge--${status}`}>
        {statusLabel}
      </span>

      <h3 className="task-card__title">{title}</h3>
      <p className="task-card__description">{description}</p>
    </div>
  );
}

export default TaskCard;
