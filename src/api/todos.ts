import { NewTodo } from '../types/NewTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = async (userId: number) => {
  const response = await client.get<Todo[]>(`/todos?userId=${userId}`);

  return response;
};

export const postTodo = async (todo: NewTodo) => {
  const response = await client.post<Todo>('/todos', todo);

  return response;
};

export const deleteTodo = async (id: number) => {
  await client.delete(`/todos/${id}`);
};

export const patchTodo = async (id: number, data: Partial<Todo>) => {
  const response = await client.patch<Todo>(`/todos/${id}`, data);

  return response;
};
