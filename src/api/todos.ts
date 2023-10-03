import { PatchTodo } from '../types/PatchTodo';
import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 10319;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodos = (data: NewTodo) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, data: PatchTodo) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
