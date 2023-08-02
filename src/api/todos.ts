import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId = 11230) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({
  title,
  completed,
  userId = 11230,
}: Partial<Todo>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const updateTodo = (id: number | undefined, todoData: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, todoData);
};
