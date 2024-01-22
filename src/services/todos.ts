import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const creatTodo = ({
  userId,
  title,
  completed,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = ({
  title, id, completed, userId,
}: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed, userId });
};
