/**
 * =============================================================
 * TASKS PAGE - Same as Session 8
 * =============================================================
 *
 * Full CRUD task management. Unchanged from Session 8 lab.
 * Included here so the TaskFlow app is complete and runnable.
 * =============================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

// Inline TaskCard and TaskInput for a self-contained file

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const isCompleted = task.status === 'completed';
  const statusLabels = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' };
  const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High' };

  return (
    <div className={`task-card ${isCompleted ? 'task-completed' : ''}`}>
      <div className="task-card-header">
        <span className={`task-status status-${task.status}`}>{statusLabels[task.status] || task.status}</span>
        <span className={`task-priority priority-${task.priority}`}>{priorityLabels[task.priority] || task.priority}</span>
      </div>
      <div className="task-card-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
      </div>
      <div className="task-card-actions">
        <button onClick={() => onToggle(task)} className="btn btn-sm btn-toggle">{isCompleted ? 'Undo' : 'Complete'}</button>
        <button onClick={() => onEdit(task)} className="btn btn-sm btn-edit">Edit</button>
        <button onClick={() => onDelete(task.id)} className="btn btn-sm btn-delete">Delete</button>
      </div>
    </div>
  );
}

function TaskInput({ onSubmit, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
      setStatus(editingTask.status || 'pending');
    } else {
      setTitle(''); setDescription(''); setPriority('medium'); setStatus('pending');
    }
  }, [editingTask]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title required'); return; }
    setIsSubmitting(true);
    try {
      const result = await onSubmit({ title: title.trim(), description: description.trim() || null, priority, status });
      if (result.success) { setTitle(''); setDescription(''); setPriority('medium'); setStatus('pending'); setError(''); }
      else setError(result.error || 'Failed');
    } catch { setError('Error occurred'); }
    finally { setIsSubmitting(false); }
  }

  return (
    <div className="task-input-container">
      <h2 className="task-input-title">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="task-input-form">
        <div className="form-group">
          <label htmlFor="task-title">Title</label>
          <input id="task-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" required disabled={isSubmitting} />
        </div>
        <div className="form-group">
          <label htmlFor="task-desc">Description</label>
          <textarea id="task-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details..." rows={2} disabled={isSubmitting} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)} disabled={isSubmitting}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </div>
          {editingTask && (
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value)} disabled={isSubmitting}>
                <option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option>
              </select>
            </div>
          )}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingTask ? 'Update' : 'Add Task'}</button>
          {editingTask && <button type="button" className="btn btn-cancel" onClick={onCancelEdit}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}

function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try { setIsLoading(true); setError(''); const res = await apiClient.get('/api/tasks'); setTasks(res.data.tasks); }
    catch (err) { setError(err.response?.data?.error || 'Failed to load tasks.'); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  async function handleCreate(data) {
    try { const res = await apiClient.post('/api/tasks', data); setTasks(prev => [res.data.task, ...prev]); return { success: true }; }
    catch (err) { return { success: false, error: err.response?.data?.error || 'Failed' }; }
  }

  async function handleUpdate(id, data) {
    try { const res = await apiClient.put(`/api/tasks/${id}`, data); setTasks(prev => prev.map(t => t.id === id ? res.data.task : t)); setEditingTask(null); return { success: true }; }
    catch (err) { return { success: false, error: err.response?.data?.error || 'Failed' }; }
  }

  async function handleToggle(task) {
    try { const res = await apiClient.patch(`/api/tasks/${task.id}`, { status: task.status === 'completed' ? 'pending' : 'completed' }); setTasks(prev => prev.map(t => t.id === task.id ? res.data.task : t)); }
    catch { setError('Failed to update task.'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    try { await apiClient.delete(`/api/tasks/${id}`); setTasks(prev => prev.filter(t => t.id !== id)); }
    catch { setError('Failed to delete task.'); }
  }

  const filtered = statusFilter === 'all' ? tasks : tasks.filter(t => t.status === statusFilter);

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>{user.username}'s Tasks</h1>
        <div className="task-stats">
          <span className="stat">{tasks.length} total</span>
          <span className="stat stat-pending">{tasks.filter(t => t.status === 'pending').length} pending</span>
          <span className="stat stat-done">{tasks.filter(t => t.status === 'completed').length} done</span>
        </div>
      </div>

      <TaskInput onSubmit={editingTask ? (data) => handleUpdate(editingTask.id, data) : handleCreate} editingTask={editingTask} onCancelEdit={() => setEditingTask(null)} />

      {error && <div className="error-message">{error} <button onClick={() => setError('')} className="error-dismiss">Dismiss</button></div>}

      <div className="task-filters">
        {['all', 'pending', 'in_progress', 'completed'].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)} className={`filter-btn ${statusFilter === f ? 'filter-active' : ''}`}>
            {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? <div className="loading-container"><p>Loading...</p></div> :
        filtered.length === 0 ? <div className="empty-state"><h3>No tasks</h3><p>Add your first task above!</p></div> :
        <div className="tasks-list">{filtered.map(t => <TaskCard key={t.id} task={t} onToggle={handleToggle} onEdit={(task) => { setEditingTask(task); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onDelete={handleDelete} />)}</div>
      }
    </div>
  );
}

export default TasksPage;
