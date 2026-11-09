import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4048;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const patchTodos = (todoId: number, fieldsToUpdate: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, fieldsToUpdate);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
