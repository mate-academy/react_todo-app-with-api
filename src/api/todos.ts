import { Todo, TodoAdd } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2265;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};

export const addTodos = ({ userId, title, completed }: TodoAdd) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const updateTodos = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};
