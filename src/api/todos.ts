import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 502;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const changeTodoApi = (id: number, data: Todo) => {
  return client.patch(`/todos/${id}`, data);
};
