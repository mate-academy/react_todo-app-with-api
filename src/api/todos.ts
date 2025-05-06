import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2365;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Todo) => {
  return client.post<Todo>(`/todos`, todo);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};
