import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

export const patchTodo = (userId: number, todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}?userId=${userId}`, todo);
};
