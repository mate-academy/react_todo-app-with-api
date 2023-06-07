import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = (userId: number, todo: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const updateTodos = (todoId: number, todo: Todo) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
