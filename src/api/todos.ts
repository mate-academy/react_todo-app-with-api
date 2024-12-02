import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 677;

export const getTodos = () => {
  return client.get<Todo[]>(`/todo?userId-${USER_ID}`);
};

export const postTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodos = (postID: number) => {
  return client.delete(`/todos/${postID}`);
};

export const updateTodos = (todoId: number, todo: Todo) => {
  return client.patch(`/todos/${todoId}`, todo);
};
