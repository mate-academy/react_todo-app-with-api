import { Todo } from '../types/types';
import { client } from '../utils/fetchClient';

export const USER_ID = 3114;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const postTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const patchTodo = (
  id: number,
  data: Partial<Omit<Todo, 'id' | 'userId'>>,
) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
