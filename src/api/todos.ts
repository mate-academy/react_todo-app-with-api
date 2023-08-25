import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const removeTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodosStatus = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const updateTodos = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};
