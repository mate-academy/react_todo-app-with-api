import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/constants';
import { client } from '../utils/fetchClient';

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deletePost = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updatePostStatus = (id: number, completed: boolean) => {
  return client.patch(`/todos/${id}`, { completed });
};

export const updateTodoTitle = (
  todoId: number, title: string,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, { title });
};
