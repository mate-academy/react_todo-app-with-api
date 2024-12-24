import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2129;
const TODOS = '/todos';

export const getTodos = () => {
  const baseUrl = `${TODOS}?userId=${USER_ID}`;

  return client.get<Todo[]>(baseUrl);
};

export const deleteTodo = (id: number) => {
  const baseUrl = `${TODOS}/${id}`;

  return client.delete(baseUrl);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  const baseUrl = `${TODOS}`;

  return client.post<Todo>(baseUrl, newTodo);
};

export const updateTodo = (id: number, completed: boolean, title?: string) => {
  const baseUrl = `${TODOS}/${id}`;

  const updateData: { completed: boolean; title?: string } = { completed };

  if (title) {
    updateData.title = title;
  }

  return client.patch(baseUrl, updateData);
};
