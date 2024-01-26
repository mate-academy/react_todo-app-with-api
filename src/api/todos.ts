import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`) as Promise<void>;
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const changeTodo = ({
  id, userId, title, completed,
}: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};
