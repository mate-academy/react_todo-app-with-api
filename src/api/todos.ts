import { Todo } from '../types';
import { client } from '../utils/FetchClients';

export const USER_ID = 12005;

export const getTodos = (userId = 12005) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number, todo: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const destroyTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, todo: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};
