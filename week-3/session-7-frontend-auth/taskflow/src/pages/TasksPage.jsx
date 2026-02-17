/**
 * =============================================================
 * TASKFLOW - TASKS PAGE (Placeholder)
 * =============================================================
 *
 * This is a placeholder for the task management page.
 * In Session 8, this will be replaced with a fully functional
 * page that fetches tasks from the API and supports CRUD.
 *
 * For now, it shows sample tasks using the TaskCard component
 * to demonstrate the UI without a backend.
 * =============================================================
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';

// Sample tasks for demonstration (will be replaced with API data in Session 8)
const SAMPLE_TASKS = [
  {
    id: 1,
    title: 'Set up development environment',
    description: 'Install Node.js, VS Code, and Git',
    status: 'completed',
    priority: 'high',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Build authentication frontend',
    description: 'Create login and register pages with React context',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2024-01-16T09:00:00Z',
  },
  {
    id: 3,
    title: 'Connect frontend to backend API',
    description: 'Integrate the React frontend with Express backend',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-17T14:00:00Z',
  },
];

function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(SAMPLE_TASKS);

  // Placeholder handlers (will be replaced with API calls in Session 8)
  function handleToggle(task) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
          : t
      )
    );
  }

  function handleEdit(task) {
    alert(`Edit task: "${task.title}" (API integration coming in Session 8)`);
  }

  function handleDelete(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>{user.username}'s Tasks</h1>
        <p className="tasks-subtitle">
          Showing sample tasks. Full API integration comes in Session 8.
        </p>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TasksPage;
