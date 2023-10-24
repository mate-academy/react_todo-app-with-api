import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const updateTodo = (todo: Todo) => {
  const { userId, title, completed }: Omit<Todo, 'id'> = todo;

  return client.patch<Todo>(`/todos/${todo.id}`, { userId, title, completed });
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
