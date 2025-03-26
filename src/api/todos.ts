import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2453;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodos = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const updateTodo = ({ id, title, completed, userId }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed, userId });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
