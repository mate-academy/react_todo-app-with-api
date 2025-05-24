import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2582;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (newTodo: Todo) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (todo: Todo) => {
  const { id, userId, title, completed } = todo;

  return client.patch(`/todos/${id}`, { userId, title, completed });
};
