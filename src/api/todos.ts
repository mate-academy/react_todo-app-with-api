import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export type TempTodo = {
  title: string,
  completed: boolean,
  userId: number,
};

export type UpdatedTodo = {
  completed: boolean,
};

export type UpdatedTitle = {
  title: string,
};

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: TempTodo) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: UpdatedTodo) => {
  return client.patch(`/todos/${todoId}`, data);
};

export const updateTodoTitle = (todoId: number, data: UpdatedTitle) => {
  return client.patch(`/todos/${todoId}`, data);
};
