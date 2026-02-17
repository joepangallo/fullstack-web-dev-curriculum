/**
 * TasksPage.jsx - Task Management Page (Container Component)
 * ------------------------------------------------------------
 * This is the main "smart" component that owns the tasks state.
 *
 * Key Concepts:
 *   1. State Ownership — The tasks array lives here because both TaskInput
 *      (to add tasks) and TaskList (to display/filter/modify tasks) need it.
 *      This is "lifting state up" to the nearest common ancestor.
 *
 *   2. Immutable State Updates — Every state update creates a NEW array/object.
 *      We NEVER modify the existing state directly. React needs new references
 *      to detect changes and re-render.
 *
 *   3. Derived Data — The task counts (total, pending, completed) are
 *      COMPUTED from the tasks array. We don't store them in separate state
 *      because they can always be calculated from what we already have.
 *      Rule: Don't put it in state if you can compute it.
 */
import { useState } from 'react';
import TaskInput from '../components/TaskInput.jsx';
import TaskList from '../components/TaskList.jsx';

function TasksPage() {
  /**
   * Tasks state — array of task objects.
   * Initialized with some sample tasks so students can see the UI immediately.
   */
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Set up React project with Vite',
      description: 'Initialize a new Vite project with React template and install dependencies.',
      status: 'completed',
      createdAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: 2,
      title: 'Build component hierarchy',
      description: 'Create Header, Footer, TaskCard, and TaskInput components.',
      status: 'in-progress',
      createdAt: new Date('2024-01-16').toISOString(),
    },
    {
      id: 3,
      title: 'Add routing with React Router',
      description: 'Set up BrowserRouter, define Routes, and create page components.',
      status: 'pending',
      createdAt: new Date('2024-01-17').toISOString(),
    },
  ]);

  /**
   * Add a new task.
   * Called by TaskInput when the form is submitted.
   * Creates a new task object and appends it to the array.
   */
  const handleAddTask = (title, description) => {
    const newTask = {
      id: Date.now(),                          // Simple unique ID
      title,
      description,
      status: 'pending',                       // New tasks always start as pending
      createdAt: new Date().toISOString(),     // ISO timestamp for sorting
    };
    // Spread existing tasks, add the new one at the end
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  /**
   * Toggle a task between 'completed' and 'pending'.
   * Uses .map() to create a new array — only the matching task changes.
   */
  const handleToggleTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'completed' ? 'pending' : 'completed',
            }
          : task
      )
    );
  };

  /**
   * Delete a task.
   * Uses .filter() to create a new array WITHOUT the deleted task.
   * filter() keeps items where the callback returns true.
   */
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // Derived data — computed from state, not stored separately
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  return (
    <div className="tasks-page">
      <h2>Task Manager</h2>

      {/* Task summary stats — computed from state */}
      <div className="task-stats">
        <span className="stat">Total: {totalTasks}</span>
        <span className="stat stat--completed">Completed: {completedTasks}</span>
        <span className="stat stat--pending">Pending: {pendingTasks}</span>
      </div>

      {/* Form to add new tasks */}
      <TaskInput onAddTask={handleAddTask} />

      {/* Task list with filtering, toggle, and delete */}
      <TaskList
        tasks={tasks}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}

export default TasksPage;
