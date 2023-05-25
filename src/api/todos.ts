import { Todo, TodoStatus, TodoTitle } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, data: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const patchTodo = (todoId: number, data: TodoTitle | TodoStatus) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
