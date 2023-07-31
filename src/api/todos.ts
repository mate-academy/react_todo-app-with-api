import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const createTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = ({
  id,
  userId,
  title,
  completed,
}: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};
