import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (
  data: Pick<Todo, 'title' | 'userId' | 'completed'>,
) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (
  todoId: number,
  data: Partial<Todo>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
