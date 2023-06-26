import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, data: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const removeTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const updateTodo = (userId: number, data: Todo) => {
  return client.patch(`/todos/${userId}`, data);
};
