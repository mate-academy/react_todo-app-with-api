import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 12345;

export const getTodos = async (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = async ({
  title,
  userId,
  completed,
}: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed,
  });
};

export const updateTodo = async (
  todoId: number,
  data: Partial<Omit<Todo, 'id' | 'userId'>>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const deleteTodo = async (todoId: number): Promise<void> => {
  await client.delete(`/todos/${todoId}`);
};
