import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (url: string, data: Todo) => {
  return client.post(url, data);
};

export const updateTodo = (todoId: number, data: Todo) => {
  return client.patch(`/todos/${todoId}`, data);
};
