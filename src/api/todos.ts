import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, title: string) => {
  return client.post<Todo>(
    '/todos',
    { userId, title, completed: false },
  );
};

export const delTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({ id, title, completed }: Todo) => {
  return client.patch<Todo>(
    `/todos/${id}`,
    { title, completed },
  );
};
