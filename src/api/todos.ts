import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteOnServer = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addOnServer = (title: string, userId: number) => {
  return client.post<Todo>('/todos', { title, completed: false, userId });
};

export const updateOnServer = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
