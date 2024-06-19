import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 762;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = ({ userId, title, completed, id }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed, id });
};

// Add more methods here
