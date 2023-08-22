import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (
  idUser: number,
  { title, completed, userId }: Omit<Todo, 'id'>,
) => {
  return client.post<Todo>(`/todos?userId=${idUser}`, {
    title,
    completed,
    userId,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (todoId: number, todoData: Partial<Todo>) => {
  return client.patch(`/todos/${todoId}`, todoData);
};
