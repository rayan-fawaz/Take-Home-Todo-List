# Todo List API

A full-stack todo list application with priority management. Built with Node.js, Express, and TypeScript.

## Features

- **Create todos** with text and priority levels
- **Delete todos** by ID
- **List all todos** sorted by priority (lowest number = highest priority)
- **Find missing priorities** to easily assign priorities to new tasks
- **Input validation** for priority (must be positive integer) and text
- **RESTful API** with proper HTTP status codes and error handling

## Problem Statement

This application allows users to manage a todo list with priority levels. Lower priority numbers indicate higher priority (e.g., priority 2 is higher than priority 5). Users can create, delete, and view todos, as well as identify missing priority levels in their list.

### Example
If your todo list has priorities: `[1, 3, 5, 5, 7, 12]`
Missing priorities would be: `[2, 4, 6, 8, 9, 10, 11]`

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **CORS:** Enabled for cross-origin requests

## Project Structure

```
backend/
├── src/
│   ├── types.ts       # Type definitions (TodoItem interface)
│   ├── todo.ts        # Business logic (add, delete, list, missing priorities)
│   ├── server.ts      # Express server and API routes
├── package.json
├── tsconfig.json
└── node_modules/
```

## Getting Started

### Installation

```bash
cd backend
npm install
```

### Running the Server

```bash
npm start
```

The server will start on `http://localhost:3001`

You should see:
```
Starting server...
Port set to: 3001
Server running on http://localhost:3001
```

## API Endpoints

### 1. Get All Todos
**Request:**
```bash
GET /api/todos
```

**Response:**
```json
[
  {
    "id": 1,
    "priority": 3,
    "text": "Call mom"
  },
  {
    "id": 2,
    "priority": 5,
    "text": "Buy milk"
  }
]
```

**Notes:** Returns todos sorted by priority (ascending), then by ID.

---

### 2. Create a Todo
**Request:**
```bash
POST /api/todos
Content-Type: application/json

{
  "text": "Buy groceries",
  "priority": 3
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "priority": 3,
  "text": "Buy groceries"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Priority must be a positive integer"
}
```

**Validation:**
- `text`: Required, must be a non-empty string
- `priority`: Required, must be a positive integer (> 0)

---

### 3. Delete a Todo
**Request:**
```bash
DELETE /api/todos/1
```

**Response (200 OK):**
```json
{
  "message": "Todo deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Todo not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid ID"
}
```

---

### 4. Get Missing Priorities
**Request:**
```bash
GET /api/missing-priorities
```

**Response:**
```json
[2, 4, 6, 8, 9, 10, 11]
```

**Notes:** 
- Returns an array of integers from 1 to the maximum priority that are NOT used by any todo
- If no todos exist, returns empty array `[]`
- If all priorities from 1 to max are used, returns empty array `[]`

---

## Testing Examples

### Using curl

**1. Add a todo:**
```bash
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"Buy milk","priority":5}'
```

**2. Get all todos:**
```bash
curl http://localhost:3001/api/todos
```

**3. Get missing priorities:**
```bash
curl http://localhost:3001/api/missing-priorities
```

**4. Delete a todo (replace 1 with actual ID):**
```bash
curl -X DELETE http://localhost:3001/api/todos/1
```

### Using Postman

1. Import these endpoints into Postman
2. Set up requests as shown in API Endpoints section above
3. Test each endpoint

## Architecture

### Data Model

**TodoItem:**
```typescript
interface TodoItem {
  id: number;           // Unique identifier (auto-incremented)
  priority: number;     // Priority level (positive integer, lower = higher priority)
  text: string;         // Task description
}
```

### In-Memory Storage

- Todos are stored in a JavaScript array in memory
- Data does NOT persist between server restarts

### Key Functions

**`addTodo(text, priority)`** - Validates and creates a new todo with unique ID

**`getTodos()`** - Returns all todos sorted by priority (ascending), then by ID

**`deleteTodo(id)`** - Deletes todo by ID, returns true if successful

**`getMissingPriorities()`** - Finds all integers from 1 to max priority not in the list
