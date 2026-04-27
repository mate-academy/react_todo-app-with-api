import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4147;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodos = (
  title: string,
  completed = false,
  userId = USER_ID,
) => {
  return client.post<Todo>(`/todos`, {
    title,
    completed,
    userId,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = (
  todoId: number,
  completed: boolean,
  title?: string,
  userId = USER_ID,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    todoId,
    completed,
    title,
    userId,
  });
};
