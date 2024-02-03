import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    userId,
    title,
    completed,
  });
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

export const updateTodo = (
  userId: number,
  todoId: number,
  completed: boolean,
) => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, { completed });
};

export const updateAllTodos = (
  userId: number,
  todoId: number,
  completed: boolean,
) => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, {
    completed,
  });
};

export const updateTitleTodo = (
  userId: number,
  todoId: number,
  title: string,
) => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, {
    title,
  });
};
