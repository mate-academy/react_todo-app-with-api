import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 391;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodos = ({ title, userId, completed }: Todo) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const upDateTodos = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};
