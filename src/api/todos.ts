import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (
  todo: Pick<Todo, 'userId' | 'title' | 'completed'>,
) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = (
  { id, title, completed }: Partial<Todo>,
) => {
  return client.patch(`/todos/${id}`, { title, completed });
};
