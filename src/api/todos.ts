import { USER_ID } from '../constans';
import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const todosService = {
  get: () => client.get<Todo[]>(`/todos?userId=${USER_ID}`),
  delete: (todoId: number) => client.delete(`/todos/${todoId}`),
  create: ({ userId, completed, title }: Omit<Todo, 'id'>) =>
    client.post<Todo>(`/todos`, {
      userId,
      completed,
      title,
    }),
  update: ({ id, userId, completed, title }: Todo) =>
    client.patch<Todo>(`/todos/${id}`, { userId, completed, title }),
};
