import {NewTodo, Todo} from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (newTodo: NewTodo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const updateTodos = (todoId: number, data: {}) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
// Add more methods here
