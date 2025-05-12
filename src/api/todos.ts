import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2305;
const BASE_TODOS_URL = '/todos';

export const getTodos = () => {
  const url = `${BASE_TODOS_URL}?userId=${USER_ID}`;

  return client.get<Todo[]>(url);
};

export const createTodo = (todoData: Omit<Todo, 'id'>) => {
  return client.post<Todo>(BASE_TODOS_URL, todoData);
};

export const deleteTodo = (todoId: number) => {
  const url = `${BASE_TODOS_URL}/${todoId}`;

  return client.delete(url);
};

export const updateTodo = ({ id, title, completed }: Todo) => {
  const url = `${BASE_TODOS_URL}/${id}`;
  const updateData = { title, completed };

  return client.patch<Todo>(url, updateData);
};
