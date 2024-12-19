import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID, TODOS_ENDPOINT } from './constants';

export const getTodos = () => {
  return client.get<Todo[]>(`${TODOS_ENDPOINT}?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(TODOS_ENDPOINT, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`${TODOS_ENDPOINT}/${todoId}`);
};

export const updateTodo = ({ id, ...todo }: Todo) => {
  return client.patch<Todo>(`${TODOS_ENDPOINT}/${id}`, todo);
};
