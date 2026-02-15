import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3971;

type NewTodo = Omit<Todo, 'id'>;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (data: NewTodo) => {
  return client.post<Todo>(`/todos`, data);
};

export const patchTodos = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
