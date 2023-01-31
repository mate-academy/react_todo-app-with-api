import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number | undefined) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string, userId: number | undefined) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const updateTodo = (
  todoId: number | undefined,
  value: string | boolean,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    value,
  });
};

export const deleteTodo = (todoId: number | undefined) => {
  return client.delete(`/todos/${todoId}`);
};
