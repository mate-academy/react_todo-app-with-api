import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const removeTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = (todo: Partial<Todo> & { id: number }) => {
  const { id, ...rest } = todo;

  return client.patch<Todo>(`/todos/${id}`, rest);
};

// Add more methods here
