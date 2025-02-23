import { Todo } from '../types/Type';
import { client } from '../utils/fetchClient';

export const USER_ID = 1249;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos/`, todo);
};

export const updateCompletedTodos = (todoId: number, complited: any) => {
  return client.patch<Todo>(`/todos/${todoId}`, complited);
};

export const updateTitleTodos = (todoId: number, title: any) => {
  return client.patch<Todo>(`/todos/${todoId}`, title);
};
