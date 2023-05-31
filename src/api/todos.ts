import { DataPatch, NewTodo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get(`/todos?userId=${userId}`);
};

export const postTodo = (data: NewTodo) => {
  return client.post('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: DataPatch) => {
  return client.patch(`/todos/${todoId}`, data);
};
