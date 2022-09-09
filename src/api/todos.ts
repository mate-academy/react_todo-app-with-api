import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string, userId: number) => {
  return client.post<Todo>(
    '/todos',
    {
      title,
      userId,
      completed: false,
      isLoading: false,
    },
  );
};

export const deleteTodo = (todoId: number) => {
  const url = `/todos/${todoId}`;

  return client.delete(url);
};

export const changeStatus = (
  id: number,
  changes: Partial<Omit<Todo, 'id'>>,
) => {
  const url = `/todos/${id}`;

  return client.patch<Todo>(
    url,
    changes,
  );
};
