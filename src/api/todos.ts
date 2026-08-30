import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodos = (newTodo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo, Omit<Todo, 'id'>>(`/todos`, newTodo);
};

export const deleteTodo = (todoId: number): Promise<unknown> => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  data: Partial<Pick<Todo, 'title' | 'completed'>>,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};
