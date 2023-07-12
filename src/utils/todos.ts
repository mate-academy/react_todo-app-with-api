import { client } from './fetchClient';
import { Todo } from '../types/Todo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const updateTodo = (
  todoId: number,
  data: { title?: string, completed?: boolean },
) => {
  return client.patch(`/todos/${todoId}`, data);
};

export const createTodo = (userId: number, title: string) => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    userId,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
