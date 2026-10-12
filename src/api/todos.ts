import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: string): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo, Omit<Todo, 'id'>>('/todos', todo);
};

export const deleteTodo = (todoId: number): Promise<unknown> => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  data: Partial<Todo>,
): Promise<Todo> => {
  return client.patch<Todo, Partial<Todo>>(`/todos/${todoId}`, data);
};
