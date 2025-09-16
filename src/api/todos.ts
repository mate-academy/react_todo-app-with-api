import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3312;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
// Add more methods here
