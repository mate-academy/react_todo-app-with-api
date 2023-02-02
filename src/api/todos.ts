import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: boolean | string) => {
  if (typeof data === 'boolean') {
    return client.patch<Todo>(`/todos/${id}`, { completed: data });
  }

  return client.patch<Todo>(`/todos/${id}`, { title: data });
};

export const updateStateTodo = (id: number, data: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed: data });
};

export const updateTitleTodo = (id: number, data: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title: data });
};
