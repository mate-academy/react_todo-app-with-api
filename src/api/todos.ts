import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (
  userId: number, newTodo: Omit<Todo, 'id'>,
) => {
  return client.post(`/todos?userId=${userId}`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: unknown) => {
  return client.patch(`/todos/${todoId}`, data);
};
