import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2129;

export const getTodos = () => {
  const baseUrl = `/todos?userId=${USER_ID}`;

  return client.get<Todo[]>(baseUrl);
};

export const deleteTodo = (id: number) => {
  const baseUrl = `/todos/${id}`;

  return client.delete(baseUrl);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  const baseUrl = `/todos`;

  return client.post<Todo>(baseUrl, newTodo);
};

export const completeTodo = (id: number, completed: boolean) => {
  const baseUrl = `/todos/${id}`;

  return client.patch(baseUrl, { completed });
};

export const renameTodo = (id: number, title: string) => {
  const baseUrl = `/todos/${id}`;

  return client.patch(baseUrl, { title: title });
};

// Add more methods here
