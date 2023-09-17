import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => client.get<Todo[]>(`/todos?userId=${userId}`);

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}/?userId=${userId}`);
};

export const addTodo = (userId: number, data: Todo | null) => {
  return client.post<Todo[]>(`/todos/?userId=${userId}`, data);
};

export const updateTodo = (
  userId: number, data: Todo | undefined, todoId: number,
) => {
  return client.patch<Todo[]>(`/todos/${todoId}/?userId=${userId}`, data);
};
