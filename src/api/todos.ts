import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

type TodoData = Pick<Todo, 'userId' | 'title' | 'completed'>;

export const createTodo = (
  { userId, title, completed } : TodoData,
) => {
  return client.post<Todo>('/todos', {
    userId,
    title,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, todoData: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, todoData);
};
