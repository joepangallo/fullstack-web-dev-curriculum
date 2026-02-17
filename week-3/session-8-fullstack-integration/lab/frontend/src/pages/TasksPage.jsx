/**
 * =============================================================
 * TASKS PAGE - Full-Stack Task Management
 * =============================================================
 *
 * This is the heart of the full-stack integration. This page:
 *   1. Fetches tasks from the Express API on mount
 *   2. Displays loading and error states
 *   3. Renders the task list with filter controls
 *   4. Handles creating, updating, toggling, and deleting tasks
 *
 * DATA FLOW:
 *   TasksPage (state owner)
 *     -> TaskInput (creates new tasks via callback)
 *     -> TaskList (displays filtered tasks)
 *       -> TaskCard (displays individual task with action callbacks)
 *
 * STATE MANAGEMENT:
 *   - tasks: Array of task objects from the API
 *   - isLoading: True while fetching tasks
 *   - error: Error message if fetch fails
 *   - filter: Current status filter ('all', 'pending', etc.)
 *
 * KEY PATTERN:
 *   "Lifting state up" - TasksPage owns the task data and passes
 *   it down as props. Children communicate back via callbacks.
 *   This keeps the data flow predictable (one-way data flow).
 * =============================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import TaskList from '../components/TaskList';
import TaskInput from '../components/TaskInput';

function TasksPage() {
  const { user } = useAuth();

  // Task data state
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit state - which task is being edited (null = none)
  const [editingTask, setEditingTask] = useState(null);

  /**
   * Fetch all tasks from the API.
   *
   * useCallback memoizes this function so it doesn't change
   * on every render, which would cause useEffect to re-run.
   */
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      // GET /api/tasks - the auth interceptor adds the JWT automatically
      const response = await apiClient.get('/api/tasks');

      setTasks(response.data.tasks);
    } catch (err) {
      const message =
        err.response?.data?.error || 'Failed to load tasks. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /**
   * Create a new task via POST /api/tasks.
   *
   * After creation, we add the new task to state directly
   * instead of re-fetching all tasks (optimistic-ish update).
   *
   * @param {object} taskData - { title, description, priority }
   */
  async function handleCreateTask(taskData) {
    try {
      const response = await apiClient.post('/api/tasks', taskData);
      const newTask = response.data.task;

      // Add the new task to the beginning of the list
      setTasks((prev) => [newTask, ...prev]);

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.error || 'Failed to create task.';
      return { success: false, error: message };
    }
  }

  /**
   * Update a task via PUT /api/tasks/:id.
   *
   * @param {number} taskId - ID of the task to update
   * @param {object} taskData - Updated fields
   */
  async function handleUpdateTask(taskId, taskData) {
    try {
      const response = await apiClient.put(`/api/tasks/${taskId}`, taskData);
      const updatedTask = response.data.task;

      // Replace the old task in state with the updated one
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );

      // Clear editing state
      setEditingTask(null);

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.error || 'Failed to update task.';
      return { success: false, error: message };
    }
  }

  /**
   * Toggle a task's completion status via PATCH /api/tasks/:id.
   *
   * Uses PATCH instead of PUT because we're only changing one field.
   * Toggles between 'completed' and 'pending'.
   *
   * @param {object} task - The task to toggle
   */
  async function handleToggleTask(task) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      const response = await apiClient.patch(`/api/tasks/${task.id}`, {
        status: newStatus,
      });
      const updatedTask = response.data.task;

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updatedTask : t))
      );
    } catch (err) {
      console.error('Failed to toggle task:', err);
      setError('Failed to update task status.');
    }
  }

  /**
   * Delete a task via DELETE /api/tasks/:id.
   *
   * Shows a confirmation dialog before deleting.
   *
   * @param {number} taskId - ID of the task to delete
   */
  async function handleDeleteTask(taskId) {
    // Ask for confirmation before deleting
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await apiClient.delete(`/api/tasks/${taskId}`);

      // Remove the task from state
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task.');
    }
  }

  /**
   * Start editing a task - sets the editingTask state
   * which is passed to TaskInput to pre-fill the form.
   */
  function handleEditTask(task) {
    setEditingTask(task);
    // Scroll to top so the form is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Cancel editing - clear the editing state.
   */
  function handleCancelEdit() {
    setEditingTask(null);
  }

  // Filter tasks based on the selected status filter
  const filteredTasks =
    statusFilter === 'all'
      ? tasks
      : tasks.filter((t) => t.status === statusFilter);

  // Calculate task statistics for the summary
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="tasks-page">
      {/* Page header with stats */}
      <div className="tasks-header">
        <h1>{user.username}'s Tasks</h1>
        <div className="task-stats">
          <span className="stat">{stats.total} total</span>
          <span className="stat stat-pending">{stats.pending} pending</span>
          <span className="stat stat-progress">{stats.inProgress} in progress</span>
          <span className="stat stat-done">{stats.completed} completed</span>
        </div>
      </div>

      {/* Task input form - for creating and editing tasks */}
      <TaskInput
        onSubmit={editingTask
          ? (data) => handleUpdateTask(editingTask.id, data)
          : handleCreateTask
        }
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
      />

      {/* Error message */}
      {error && (
        <div className="error-message">
          {error}
          <button
            onClick={() => setError('')}
            className="error-dismiss"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Status filter buttons */}
      <div className="task-filters">
        {['all', 'pending', 'in_progress', 'completed'].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`filter-btn ${statusFilter === filter ? 'filter-active' : ''}`}
          >
            {filter === 'all'
              ? 'All'
              : filter === 'in_progress'
              ? 'In Progress'
              : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Task list with loading and empty states */}
      {isLoading ? (
        <div className="loading-container">
          <p>Loading tasks...</p>
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggleTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default TasksPage;
