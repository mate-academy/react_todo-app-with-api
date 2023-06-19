import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { RequestTodos } from '../types/RequestTodos';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number, data: RequestTodos) => {
  return client.post<Todo>(`/todos?/userId=${userId}`, data);
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};
