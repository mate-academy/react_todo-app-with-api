import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId?: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string, userId?: number) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const updateTodo = (todoId: number, value: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    completed: value,
  });
};

export const updateTodoTitle = (
  todoId: number | undefined,
  value: string,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    title: value,
  });
};

export const deleteTodo = (todoId: number | undefined) => {
  return client.delete(`/todos/${todoId}`);
};
