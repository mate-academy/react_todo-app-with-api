import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2153;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const updateTodo = ({ id, title, userId, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { id, title, userId, completed });
};
