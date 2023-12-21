import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (title: string, userId: number) => {
  const data = { title, userId, completed: false };

  return client.post<Todo>('/todos', data);
};

export const updateTodo = ({
  id,
  userId,
  title,
  completed,
}: Todo) => {
  const data = {
    id, userId, title, completed,
  };

  return client.patch(`/todos/${id}`, data);
};
