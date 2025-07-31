import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3154;

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number): Promise<void> => {
  return client.delete(`/todos/${id}`) as Promise<void>;
};

export const updateTodo = (id: number, data: Partial<Omit<Todo, 'id'>>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
