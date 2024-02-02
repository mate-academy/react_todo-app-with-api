import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodos = ({ completed, title, id }: Omit<Todo, 'userId'>) => {
  return client.patch<Todo>(`/todos/${id}`, { completed, title });
};
