import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (todo: NewTodo) => {
  return client.post<Todo>('/todos', todo);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, data: Partial<Todo>): Promise<Todo> => {
  return client.patch(`/todos/${id}`, data);
};
