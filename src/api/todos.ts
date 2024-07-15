import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 854;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post(`/todos`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({
  id,
  userId,
  title,
  completed,
}: Todo): Promise<Todo> => {
  return client.patch(`/todos/${id}`, { title, userId, completed });
};
