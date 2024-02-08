import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => client
  .delete(`/todos/${todoId}`);

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post('/todos/', { title, userId, completed });
};

export const editTodo = (
  {
    id,
    title,
    userId,
    completed,
  }: Todo,
) => {
  return client.patch(`/todos/${id}`, { title, userId, completed });
};

// Add more methods here
