import { TodoItem } from './types';


// In-memory storage
const todos: TodoItem[] = [];
let nextId = 1;

//Add a new todo item
export function addTodo(text: string, priority: number): TodoItem {
//Validate priority is a positive integer
if (!Number.isInteger(priority) || (priority <= 0)) {
  throw new Error("Priority must be a postive integer ");
}
//Validate text is not empty
if (!text || text.trim().length === 0) {
  throw new Error("Text cannot be empty");
}
const newTodo: TodoItem = { id: nextId++, text: text.trim(), priority };
todos.push(newTodo);
return newTodo;
}

//Get all todo items
export function getTodos(): TodoItem[] {
  return todos.sort((a, b) => {
    // First, sort by priority (ascending)
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // If priorities are equal, sort by id (ascending)
    return a.id - b.id;
  });
}

export function getMissingPriorities(): number[] {
    const existingPriorities = new Set(todos.map(todo => todo.priority));
    const missingPriorities: number[] = [];
    const maxPriority = todos.reduce((max, todo) => Math.max(max, todo.priority), 0);

    for (let i = 1; i <= maxPriority; i++) {
        if (!existingPriorities.has(i)) {
            missingPriorities.push(i);
        }
    }

    return missingPriorities;
}

//Delete a todo item by id
export function deleteTodo(id: number) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
        return false // Todo item not found
    }
    todos.splice(index, 1);
    return true; // Deletion successful
}