import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2142;
const TODOS_PATH = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(`${TODOS_PATH}?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`${TODOS_PATH}`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`${TODOS_PATH}/${id}`);
};

export const updateTodo = (id: number, data: Omit<Todo, 'id'>) => {
  return client.patch(`${TODOS_PATH}/${id}`, data);
};
