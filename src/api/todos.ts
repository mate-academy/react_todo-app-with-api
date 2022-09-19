import { Todo, CreateTodoFragment, UpdateTodoFragment } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (todo: CreateTodoFragment) => {
  return client.post<Todo>('/todos', todo);
};

export const editTodo = (todoId: number, status: UpdateTodoFragment) => {
  return client.patch<Todo>(`/todos/${todoId}`, status);
};

export const removeTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};
