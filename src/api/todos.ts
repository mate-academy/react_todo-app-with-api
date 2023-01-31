import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (userId: number, todo: any) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const updateTodo = (todoId: number, todo: any) => {
  return client.patch(`/todos/${todoId}`, todo);
};
