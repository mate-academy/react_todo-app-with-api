import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete<Todo>(`/todos/${todoId}`);
};

export const createTodo = (title: string, userId: number) => {
  return client.post<Todo>(
    '/todos',
    {
      userId,
      title,
      completed: false,
    },
  );
};

export const upDateTodo = (todoId: number, date: Partial<Todo>) => {
  return client.patch<Todo>(
    `/todos/${todoId}`,
    date,
  );
};
