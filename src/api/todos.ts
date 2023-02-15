import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 6315;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${USER_ID}`);
};

export const updateTodo = (
  todoId: number,
  propsToUpdate: Partial<Todo>,
) => {
  return client.patch<Todo>(`/todos/${todoId}?userId=${USER_ID}`, propsToUpdate);
};
