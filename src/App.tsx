
import './App.css'
import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editedTodo, setEditedTodo] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getTodos();
  }, []);

  async function getTodos() {
    const response = await fetch('https://petstore3.swagger.io/api/v3/pet/findByStatus?status=available');
    const data = await response.json();
    setTodos(data);
  }

  async function addTodo() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify({ title: newTodo }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setTodos([...todos, data]);
    setNewTodo('');
  }

  async function updateTodo() {
    const response = await fetch(`${editedTodo.id}`, {
      method: 'PUT',
      body: JSON.stringify(editedTodo),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setTodos(todos.map(todo => (todo.id === editedTodo.id ? data : todo)));
    setEditedTodo({});
    setEditing(false);
  }

  async function deleteTodo(id) {
    await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE'
    });
    setTodos(todos.filter(todo => todo.id !== id));
  }

  function handleInputChange(event) {
    setNewTodo(event.target.value);
  }

  function handleEditClick(todo) {
    setEditedTodo({
      id: todo.id,
      title: todo.title,
      completed: todo.completed
    });
    setEditing(true);
  }

  function handleEditInputChange(event) {
    setEditedTodo({
      ...editedTodo,
      [event.target.name]: event.target.value
    });
  }

  function handleCancelClick() {
    setEditedTodo({});
    setEditing(false);
  }

  return (
    <div>
      <h1>Todos List</h1>

      <form onSubmit={event => {
        event.preventDefault();
        if (editing) {
          updateTodo();
        } else {
          addTodo();
        }
      }}>
        <input type="text" value={newTodo} onChange={handleInputChange} placeholder="New Todo" />
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" onClick={handleCancelClick}>Cancel</button>}
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.name}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            <button onClick={() => handleEditClick(todo)}>Edit</button>
          </li>
        ))}
      </ul>

      {editing && (
        <form onSubmit={event => {
          event.preventDefault();
          updateTodo();
        }}>
          <input type="text" name="title" value={editedTodo.title} onChange={handleEditInputChange} placeholder="Edit Todo" />
          <button type="submit">Update</button>
          <button type="button" onClick={handleCancelClick}>Cancel</button>
        </form>
      )}
    </div>
  );

      }

export default App
