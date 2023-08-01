import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodos = (todosId: number) => {
  return client.delete(`/todos/${todosId}`);
};

export const updateTodo = (id: number, {
  title,
  completed,
  userId,
}: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed, userId });
};
