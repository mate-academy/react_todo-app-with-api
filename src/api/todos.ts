import { Todo, TodoAdd, TodoEdit } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

// Dodaj nowe zadanie na serwerze
export const addTodo = (newTodo: TodoAdd) => {
  return client.post<Todo>('/todos', newTodo);
};

// Usuń zadanie o określonym ID z serwera
export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Edycja zadania na serwerze
// `todoId` to identyfikator zadania, które chcemy edytować
// `updatedTodo` zawiera nowe dane zadania, które mają zostać zapisane na serwerze
export const editTodo = (todoId: number, updatedTodo: TodoEdit) => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedTodo);
};
