/* eslint-disable */
// @ts-ignore
import { Todo } from '../types/Todo.ts';
// @ts-ignore
import { client } from '../utils/fetchClient.ts';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createNewTodo = ({ title, completed, userId }: Todo) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, ...todoData } : Todo) => {
  return client.patch<Todo>(`/todos/${id}`, todoData);
};
