import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4221;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>(`/todos`, todo);
};

export const patchTodo = (id: number, todo: Partial<Todo>): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
