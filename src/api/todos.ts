import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 764;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Todo) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, updatedData: Partial<Todo>) => {
  return client.patch(`/todos/${id}`, updatedData);
};
