import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3093;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: Todo['id'], data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
