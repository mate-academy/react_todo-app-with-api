import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (userId: number, todo: Todo) => {
  return client.post<Todo[]>(`/todos?userId=${userId}`, todo);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const editTodos = (id: number, todo: Todo) => {
  return client.patch(`/todos/${id}`, todo);
};
