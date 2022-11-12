import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (
  userId: number,
  title: string,
) => {
  return client.post<Todo>(
    `/todos?userId=${userId}`,
    {
      title,
      userId,
      completed: false,
    },
  );
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const toggleTodo = (todoId: number, completed: boolean) => {
  return client.patch<Partial<Todo>>(
    `/todos/${todoId}`,
    {
      completed: !completed,
    },
  );
};

export const editTodo = (todoId: number, title: string) => {
  return client.patch<Partial<Todo>>(
    `/todos/${todoId}`,
    {
      title,
    },
  );
};
