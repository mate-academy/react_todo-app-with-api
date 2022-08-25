import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (
  title: string,
  userId: number,
  completed: boolean,
) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoById = (todoId: number, data: {}) => {
  return client.patch(`/todos/${todoId}`, data);
};
