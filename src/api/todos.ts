import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodos = (todoId: string) => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodos = ({
  id, userId, title, completed,
}: Todo) => client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
