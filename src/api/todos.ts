import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (
  userId: number,
  title: string,
  completed: boolean,
): Promise<Todo> => {
  return client.post('/todos', {
    userId,
    title,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: any) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
