import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const editTodo = (todoId: number, data: unknown) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (data: unknown) => {
  return client.post('/todos', data);
};
