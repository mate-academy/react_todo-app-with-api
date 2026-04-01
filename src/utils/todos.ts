import { Todo } from '../types/Todo';
import { client } from './fetchClient';

export const USER_ID = 4081;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, {
    userId,
    title,
    completed,
  });
};

export const updateTodo = ({ id, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};
