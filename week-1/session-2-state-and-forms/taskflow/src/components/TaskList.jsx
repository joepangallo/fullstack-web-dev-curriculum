/**
 * TaskList.jsx - Filterable Task List
 * -------------------------------------
 * Displays tasks with filtering capability.
 *
 * Key Concepts:
 *   1. Local State for UI — The `filter` state controls which tasks are SHOWN,
 *      but it doesn't change the actual tasks data. It's purely a UI concern.
 *      This is different from the tasks state in TasksPage which is the "source of truth."
 *
 *   2. Derived/Computed Data — `filteredTasks` is computed from `tasks` and `filter`.
 *      We don't store filtered tasks in state because they can always be calculated.
 *      This is a key React principle: derive what you can, store only what you must.
 *
 *   3. Array Methods — .filter() and .map() are your best friends in React:
 *      - .filter() creates a new array with items that match a condition
 *      - .map() transforms each item in an array into something new (JSX elements)
 *
 *   4. Composition — TaskList renders TaskCard components for each task.
 *      TaskList handles the "which tasks to show" logic.
 *      TaskCard handles "how a single task looks" logic.
 */
import { useState } from 'react';
import TaskCard from './TaskCard.jsx';

function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  /**
   * Filter state — controls which tasks are displayed.
   * Options: 'all', 'pending', 'completed'
   * This is LOCAL state because only this component needs it.
   */
  const [filter, setFilter] = useState('all');

  /**
   * Compute the filtered task list based on the current filter.
   * This runs on every render, but it's fast — .filter() is O(n).
   *
   * We could use useMemo for optimization, but it's unnecessary for
   * small lists. Premature optimization is the root of all evil!
   */
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;              // Show everything
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  return (
    <div className="task-list-container">
      {/* Filter buttons */}
      <div className="filter-buttons">
        {/*
          Each button sets the filter state.
          The active button gets a special CSS class for visual feedback.
        */}
        <button
          className={`btn btn-filter ${filter === 'all' ? 'btn-filter--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({tasks.length})
        </button>
        <button
          className={`btn btn-filter ${filter === 'pending' ? 'btn-filter--active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({tasks.filter((t) => t.status === 'pending').length})
        </button>
        <button
          className={`btn btn-filter ${filter === 'completed' ? 'btn-filter--active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({tasks.filter((t) => t.status === 'completed').length})
        </button>
      </div>

      {/* Task list or empty state */}
      {filteredTasks.length === 0 ? (
        <div className="task-list-empty">
          <p>
            {filter === 'all'
              ? 'No tasks yet. Add one above!'
              : `No ${filter} tasks.`}
          </p>
        </div>
      ) : (
        <div className="task-grid">
          {/*
            .map() renders a TaskCard for each filtered task.
            We spread the task properties as individual props.
            key={task.id} is required for React's list reconciliation.
          */}
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              status={task.status}
              description={task.description}
              createdAt={task.createdAt}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
