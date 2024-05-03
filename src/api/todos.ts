import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 402;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Todo) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};
