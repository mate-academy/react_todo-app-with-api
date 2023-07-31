import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const patchTodo = (userId: number, { id, ...rest }: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}?userId=${userId}`, rest);
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

// Add more methods here
