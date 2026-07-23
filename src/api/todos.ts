import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 634;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({
  id,
  completed,
  title,
}: Partial<Todo> & { id: number }) => {
  return client.patch<Todo>(`/todos/${id}`, { completed, title });
};
