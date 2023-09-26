import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodos = (todoID: number) => {
  return client.delete(`/todos/${todoID}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${todo.userId}`, todo);
};

export const updateTodo = ({
  id,
  userId,
  title,
  completed,
} :Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};
