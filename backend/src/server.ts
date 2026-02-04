import express from 'express';
import cors from 'cors';
import { addTodo, getTodos, deleteTodo, getMissingPriorities } from './todo';

console.log('Starting server...');

const app = express();
const PORT = 3001;

console.log(`Port set to: ${PORT}`);

app.use(cors());
app.use(express.json());


app.get('/api/todos', (req, res) => {
  res.json(getTodos());
});

app.post('/api/todos', (req, res) => {
  // 1. Extract data from request body
  const { text, priority } = req.body;
  
  // 2. Validate request has required fields
  if (typeof text !== 'string' || typeof priority !== 'number') {
    return res.status(400).json({ error: "Invalid input" });
  }
  
  // 3. Try to add todo (might throw error)
  try {
    const newTodo = addTodo(text, priority);
    res.status(201).json(newTodo);
  } catch (error) {
    // 4. Handle validation errors from addTodo
    res.status(400).json({ error: (error as Error).message });
  }
});

app.delete('/api/todos/:id', (req, res) => {
  // 1. Convert string to number
  const id = parseInt(req.params.id);
  
  // 2. Validate it's a valid number
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  
  // 3. Try to delete
  const success = deleteTodo(id);
  
  // 4. Send appropriate response
  if (success) {
    res.status(200).json({ message: "Todo deleted successfully" });
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

app.get('/api/missing-priorities', (req, res) => {
  // Call getMissingPriorities() and return as JSON
    res.json( getMissingPriorities() );
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});