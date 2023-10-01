import { Todo, TempTodo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export type UpdatedTitle = {
  title: string,
};

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (data: TempTodo) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodo
= (todo: Partial<Todo> & { id: number }) => {
  const { id, ...rest } = todo;

  return client.patch<Todo>(`/todos/${id}`, rest);
};

export const updateTodo = (todoId: number, data: object) => {
  return client.patch(`/todos/${todoId}`, data);
};
