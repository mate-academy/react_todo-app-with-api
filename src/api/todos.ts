import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 196;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = ({ title }: Pick<Todo, 'title'>) => {
  return client.post<Todo>(`/todos`, {
    title,
    completed: false,
    userId: USER_ID,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, todo: Todo) => {
  return client.patch(`/todos/${todoId}`, todo);
};
