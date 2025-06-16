import { Todo } from '../types/types';
import { client } from '../utils/fetchClient';

type UpdateTodoData =
  | { title: string; completed?: never }
  | { completed: boolean; title?: never };

export const USER_ID = 3049;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, data: UpdateTodoData) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
