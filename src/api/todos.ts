/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (url: string) => {
  return client.delete(url);
};

export const updateTodo = (url: string, data: any) => {
  return client.patch(url, data);
};

export const createTodo = (url: string, data: any) => {
  return client.post(url, data);
};
