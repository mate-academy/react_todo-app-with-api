import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';

export const USER_ID = 1551;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const updateTodo = ({
  id,
  completed,
  ...todoData
}: {
  id: number;
  completed: boolean;
}) => {
  return client.patch<Todo>(`/todos/${id}`, { ...todoData, completed });
};

// Add more methods here
