/**
 * TodosPage.jsx - Todos Page (Container Component)
 * ---------------------------------------------------
 * This page manages the todo state and renders the TodoList and AddTodoForm.
 *
 * Key Concepts:
 *   1. Lifting State Up — The todos array lives HERE (in the parent), not in
 *      TodoList or AddTodoForm. Both children need access to the same data,
 *      so we "lift" state up to the nearest common ancestor.
 *
 *   2. State is the "Single Source of Truth" — There's ONE todos array, and
 *      it lives in ONE place. All child components get their data from here.
 *
 *   3. Passing Callbacks as Props — We pass `handleAddTodo` down to AddTodoForm
 *      so the child can "communicate up" to the parent when a new todo is added.
 *      Data flows DOWN (via props), events flow UP (via callback props).
 */
import { useState } from 'react';
import TodoList from '../components/TodoList.jsx';
import AddTodoForm from '../components/AddTodoForm.jsx';

function TodosPage() {
  /**
   * The todos state — an array of todo objects.
   * Each todo has: id, text, completed
   * This starts as an empty array; TodoList will simulate loading data.
   */
  const [todos, setTodos] = useState([]);

  /**
   * Handler to add a new todo.
   * This function is passed to AddTodoForm as a prop (callback).
   * When the form submits, it calls this function with the new todo text.
   *
   * We use the spread operator (...) to create a NEW array with all existing
   * todos plus the new one. We never mutate state directly in React!
   *   WRONG: todos.push(newTodo)       — mutates the existing array
   *   RIGHT: setTodos([...todos, newTodo]) — creates a new array
   */
  const handleAddTodo = (todoText) => {
    const newTodo = {
      id: Date.now(),           // Simple unique ID (timestamp in milliseconds)
      text: todoText,
      completed: false,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  /**
   * Handler to toggle a todo's completed status.
   * Uses .map() to create a new array where only the matching todo is changed.
   * Every other todo stays exactly the same (spread with ...todo).
   */
  const handleToggleTodo = (todoId) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, completed: !todo.completed }  // Flip the completed boolean
          : todo                                       // Leave other todos unchanged
      )
    );
  };

  return (
    <div className="todos-page">
      <h2>My Todos</h2>

      {/* Form to add new todos — receives our callback as a prop */}
      <AddTodoForm onAddTodo={handleAddTodo} />

      {/* List of todos — receives the state and toggle handler as props */}
      <TodoList todos={todos} onToggleTodo={handleToggleTodo} setTodos={setTodos} />
    </div>
  );
}

export default TodosPage;
