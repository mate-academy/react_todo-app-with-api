import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoCompletedUpdate } from '../types/TodoCompletedUpdate';
import { TodoTitleUpdate } from '../types/TodoTitleUpdate';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const post = (userId: number, title: string) => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    title,
    completed: false,
    userId,
  });
};

export const remove = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchToggleTodo = (todoId: number, completed: boolean) => {
  const todoCompletedUpdate: TodoCompletedUpdate = { completed };

  return client.patch(`/todos/${todoId}`, todoCompletedUpdate);
};

export const patchTitle = (todoId: number, title: string) => {
  const todoTitleUpdate: TodoTitleUpdate = { title };

  return client.patch(`/todos/${todoId}`, todoTitleUpdate);
};
