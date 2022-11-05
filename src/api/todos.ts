import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, title: string) => {
  const data = {
    title,
    userId,
    completed: false,
  };

  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);

export const toggleTodo = (todoId: number, completed: boolean) => {
  const data = {
    completed,
  };

  return client.patch(`/todos/${todoId}`, data);
};

export const updateTodo = (todoId: number, title: string) => {
  const data = {
    title,
  };

  return client.patch(`/todos/${todoId}`, data);
};
