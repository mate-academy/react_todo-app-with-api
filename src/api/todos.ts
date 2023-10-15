import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (editTodo: Todo) => {
  const {
    id,
    userId,
    title,
    completed,
  } = editTodo;

  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};

export const postTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};
