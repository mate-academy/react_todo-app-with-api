import { OptionalAttributes } from '../types/OptionalAttributes';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 12004;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: OptionalAttributes<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
