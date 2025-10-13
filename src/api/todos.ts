import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3555;

// Get all todos for the user
export const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);

// Add a new todo
export const addTodo = (title: string) =>
  client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });

// Delete a todo by id
export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);

// Update a todo (patch)
export const updateTodo = (todoId: number, data: Partial<Todo>) =>
  client.patch<Todo>(`/todos/${todoId}`, data);
