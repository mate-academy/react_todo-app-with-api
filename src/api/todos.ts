import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number): Promise<Todo> => {
  return client.delete<Todo>(`/todos/${id}`);
};

export const updateTodo = (id: number, data: Partial<Todo>): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
