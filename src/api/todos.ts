import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, todo: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const patchTodo = (id: number, todoToUpdate: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, todoToUpdate);
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};
