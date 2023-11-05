import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client
    .get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: Omit<Todo, keyof Todo>) => {
  return client
    .post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client
    .delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client
    .patch(`/todos/${todoId}`, data);
};
