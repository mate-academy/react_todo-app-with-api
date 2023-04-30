import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number, todo: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const updateTodo = (todoId: number, todo: Todo) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
