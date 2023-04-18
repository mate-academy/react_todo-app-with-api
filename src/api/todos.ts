import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (title: string, userId: number) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (
  todoId: number,
  data: Partial<Omit<Todo, 'id'>>,
) => {
  return client.patch(`/todos/${todoId}`, data);
};
