import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const USER_ID = 1;

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (title: string, userId: number): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  data: Partial<Todo>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
