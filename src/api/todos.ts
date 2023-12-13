import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const newPost = async (userId: number, title: string): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    userId,
    title,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const upDateTodoStatus = (id: number, completed: boolean) => {
  return client.patch(
    `/todos/${id}`,
    { completed },
  );
};

export const upDateTodoTitle = (id: number, title: string) => {
  return client.patch(
    `/todos/${id}`,
    { title },
  );
};
