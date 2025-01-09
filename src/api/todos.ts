import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2085;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (TODO_ID: number) => {
  return client.delete(`/todos/${TODO_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, todo);
};

export const updateTodo = (
  TODO_ID: number,
  updatedTodo: Pick<Todo, 'completed'> | Pick<Todo, 'title'>,
) => {
  return client.patch<Todo>(`/todos/${TODO_ID}`, updatedTodo);
};
