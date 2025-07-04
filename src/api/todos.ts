import { PartialTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3023;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (data: Todo) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodos = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = (data: PartialTodo) => {
  return client.patch<Todo>(`/todos/${data.id}`, data);
};
