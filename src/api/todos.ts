import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, title: string) => {
  const newTodo = {
    title,
    userId,
    completed: false,
  };

  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateTodo = (todoId: number, data: any) => {
  return client.patch(`/todos/${todoId}`, data);
};
