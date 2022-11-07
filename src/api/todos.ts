import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string, userId: number) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const editCompleteTodoStatus = (
  todoId: number,
  completed: boolean,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    completed,
  });
};

export const changeTitle = (
  todoId: number,
  title: string,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    title,
  });
};
