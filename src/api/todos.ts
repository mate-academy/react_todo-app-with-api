import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 699;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Partial<Todo>) =>
  client.post<Todo>('/todos', data);

export const deleteTodo = (todoId: number) => {
  return client.delete<Todo[]>(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
