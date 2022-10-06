import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, title: string) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodoStatus = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    completed,
  });
};

export const changeTodoTitle = (todoId: number, title: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    title,
  });
};
