import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4557;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const removeTodo = (todoId: number) => client.delete(`/todos/${todoId}`);

export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
