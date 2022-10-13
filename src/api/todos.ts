import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = (title: string, userId: number) => {
  return client.post<Todo>('/todos',
    {
      title,
      userId,
      completed: false,
    });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client.patch(`/todos/${todoId}`, data);
};
