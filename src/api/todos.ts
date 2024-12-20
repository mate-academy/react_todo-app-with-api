import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1905;
const BASE_PATH = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(`${BASE_PATH}?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete<number>(`${BASE_PATH}/${id}?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>(`${BASE_PATH}?userId=${USER_ID}`, {
    userId: USER_ID,
    title: title,
    completed: false,
  });
};

export const updateTodo = ({ id, title, completed }: Omit<Todo, 'userId'>) => {
  return client.patch<Todo>(`${BASE_PATH}/${id}?userId=${USER_ID}`, {
    userId: USER_ID,
    id,
    title,
    completed,
  });
};
