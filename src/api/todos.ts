import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 462;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};

export const updateTodo = ({ title, completed, userId, id }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed, userId, id });
};
