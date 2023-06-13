import { Todo } from '../types/Todo';
import { client } from '../utils/FetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (todoId: number, data: unknown) => {
  return client.patch(`/todos/${todoId}`, data);
};
