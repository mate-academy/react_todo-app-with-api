import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4514;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { ...todo, userId: USER_ID });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (
  id: number,
  changes: Partial<Pick<Todo, 'title' | 'completed'>>,
) => {
  return client.patch<Todo>(`/todos/${id}`, changes);
};
