import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (
  data: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (
  id: number,
  newFields: Omit<Todo, 'id' | 'userId' | 'title' | 'createdAt' | 'updatedAt'>
  | Omit<Todo, 'id' | 'userId' | 'completed' | 'createdAt' | 'updatedAt'>,
) => {
  return client.patch<Todo>(`/todos/${id}`, newFields);
};
// Add more methods here
