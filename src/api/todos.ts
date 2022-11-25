import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string, userId: number): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  data: Partial<Omit<Todo, 'id'>>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
