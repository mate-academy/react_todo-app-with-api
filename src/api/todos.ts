import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2780;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const patchTodos = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const postTodos = (data: Partial<Todo>) => {
  return client.post<Todo>(`/todos`, { ...data, userId: USER_ID });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
