import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 709;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};

export const updateTodo = ({ userId, title, completed, id }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed, id });
};
