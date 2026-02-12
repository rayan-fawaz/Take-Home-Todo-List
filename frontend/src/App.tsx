import { useState, useEffect } from 'react'
import type { TodoItem } from './types'
import './App.css'

const API_URL = 'http://localhost:3001/api';

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('');
  const [missingPriorities, setMissingPriorities] = useState<number[]>([]);
  const [showMissing, setShowMissing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      const data = await response.json();
      setTodos(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch todos');
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    const priorityNum = parseInt(priority);
    if (!text.trim() || isNaN(priorityNum) || priorityNum <= 0) {
      setError('Please enter valid text and priority (positive integer)');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), priority: priorityNum })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to add todo');
        return;
      }

      setText('');
      setPriority('');
      setError('');
      fetchTodos();
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        setError('Failed to delete todo');
        return;
      }

      setError('');
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleShowMissing = async () => {
    try {
      const response = await fetch(`${API_URL}/missing-priorities`);
      const data = await response.json();
      setMissingPriorities(data);
      setShowMissing(true);
      setError('');
    } catch (err) {
      setError('Failed to fetch missing priorities');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Todo List</h1>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Task description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: '8px 12px', fontSize: '14px', flex: 1 }}
        />
        <input
          type="number"
          placeholder="Priority (1+)"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ padding: '8px 12px', fontSize: '14px', width: '130px' }}
        />
        <button type="submit" style={{ padding: '8px 20px', fontSize: '14px' }}>Add Todo</button>
      </form>

      <button onClick={handleShowMissing} style={{ marginBottom: '24px', padding: '8px 20px', fontSize: '14px' }}>
        Show Missing Priorities
      </button>

      {showMissing && (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <strong>Missing Priorities:</strong> {missingPriorities.length > 0 ? missingPriorities.join(', ') : 'None'}
        </div>
      )}

      <h2>Todo Items ({todos.length})</h2>
      {todos.length === 0 ? (
        <p>No todos yet. Add one above!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Priority</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Task</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{todo.id}</td>
                <td style={{ padding: '10px' }}>{todo.priority}</td>
                <td style={{ padding: '10px' }}>{todo.text}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
