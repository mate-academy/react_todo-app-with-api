import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number, title: string) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const deleteTodo = (todoID: number) => {
  return client.delete(`/todos/${todoID}`);
};

export const patchTodo = (
  todoId: number,
  data: Partial<Todo>,
): Promise<Todo> => client.patch(`/todos/${todoId}`, data);
