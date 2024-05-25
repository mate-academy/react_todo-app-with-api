import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 665;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (
  todoId: number,
  updatedData: Partial<Omit<Todo, 'id'>>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedData);
};
