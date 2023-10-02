import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ title, completed, userId }:
Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (todoId: number): Promise<void> => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Todo): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
