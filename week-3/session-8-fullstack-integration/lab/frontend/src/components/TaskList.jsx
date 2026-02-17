/**
 * =============================================================
 * TASK LIST COMPONENT - Renders a Collection of Tasks
 * =============================================================
 *
 * Receives an array of tasks and renders TaskCard for each one.
 * Handles the empty state when no tasks match the filter.
 *
 * COMPONENT HIERARCHY:
 *   TasksPage -> TaskList -> TaskCard (for each task)
 *
 * SEPARATION OF CONCERNS:
 *   - TasksPage: Owns the data, handles API calls
 *   - TaskList: Layout and empty state handling
 *   - TaskCard: Individual task display and actions
 *
 * This is a "presentational" component - it receives data
 * as props and renders it. No state management or API calls.
 *
 * PROPS:
 *   tasks    - Array of task objects to display
 *   onToggle - Callback when a task's status is toggled
 *   onEdit   - Callback when edit button is clicked
 *   onDelete - Callback when delete button is clicked
 * =============================================================
 */

import TaskCard from './TaskCard';

function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  // Empty state - show a friendly message
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks found</h3>
        <p>
          No tasks match your current filter, or you haven't created
          any tasks yet. Use the form above to add your first task!
        </p>
      </div>
    );
  }

  return (
    <div className="tasks-list">
      {/*
        Map over the tasks array and render a TaskCard for each one.

        KEY PROP:
        The `key` prop helps React identify which items changed,
        were added, or removed. Use a unique identifier (like id),
        NOT the array index. Using index as key causes bugs when
        items are reordered or deleted.
      */}
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
