import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (data: Omit <Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, todo: Partial<Todo>) => {
  return client.patch(`/todos/${id}`, todo);
};
