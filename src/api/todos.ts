import { Todo, PathchingTodo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 6623;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (data: Todo) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, data: PathchingTodo) => {
  return client.patch<PathchingTodo>(`/todos/${id}`, data);
};
