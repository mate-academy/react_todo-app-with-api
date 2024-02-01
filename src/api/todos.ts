import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos/', { title, userId, completed });
};

export const updateTodo = (
  todoId: number,
  dateUpdate: Partial<Todo>,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, dateUpdate);
};

// Add more methods here
