import { Todo } from '../libs/types/Todo';
import { client } from '../libs/utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (
  data: Omit<Todo, 'id'>,
) => {
  return client.post<Todo>('/todos', data);
};

export const updateTodo = (
  id: number,
  data: Partial<Todo>,
) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
