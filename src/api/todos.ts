import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1591;

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> =>
  client.post<Todo>('/todos', todo);

export const patchTodo = (propsToChange: object, id: number): Promise<Todo> =>
  client.patch<Todo>(`/todos/${id}`, propsToChange);

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);
