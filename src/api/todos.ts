import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2452;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ userId, title }: Omit<Todo, 'completed' | 'id'>) => {
  const body = { userId, title, completed: false };

  return client.post<Todo>('/todos', body);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({ id, userId, title, completed }: Todo) => {
  const body = { userId, title, completed };

  return client.patch<Todo>(`/todos/${id}`, body);
};
