import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (data: Todo) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodos = (id: number, property: string | boolean) => {
  const nameOfProperty = typeof property === 'string' ? 'title' : 'completed';

  return client.patch(`/todos/${id}`, { [nameOfProperty]: property });
};
