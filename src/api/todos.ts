import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, todoToPost: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todoToPost);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, todoToUpdate: Todo) => {
  return client.patch<Todo>(`/todos/${todoId}`, todoToUpdate);
};
