import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const post = (newTitle: string, inputUserId: number) => {
  return client.post<Todo>('/todos',
    {
      title: newTitle,
      userId: inputUserId,
      completed: false,
    });
};

export const remove = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updatingData = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`,
    data);
};
