import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3659;

export const getTodos = async () => {
  const todos = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

  return todos;
};

export const postTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${data.id}`, data);
};
