import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 350;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const updateTodo = (updatedTodo: Todo) => {
  const { id, ...rest } = updatedTodo;

  return client.patch<Todo>(`/todos/${id}`, rest);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
