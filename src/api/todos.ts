import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 6378;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', {
    title,
    completed,
    userId: userId || USER_ID,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({
  id,
  title,
  completed,
}: Partial<Todo> & { id: number }) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};
