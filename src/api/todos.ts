import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 11857;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodos = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};
