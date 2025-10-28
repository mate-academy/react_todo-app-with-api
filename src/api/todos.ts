import { client } from '../utils/fetchClient';
import type { Todo } from '../types/Todo';
import { USER_ID } from '../constants/user';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo, Pick<Todo, 'title' | 'userId' | 'completed'>>(
    '/todos',
    {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    },
  );
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (
  id: number,
  data: Partial<Pick<Todo, 'title' | 'completed'>>,
) => {
  return client.patch<Todo, Partial<Pick<Todo, 'title' | 'completed'>>>(
    `/todos/${id}`,
    data,
  );
};
