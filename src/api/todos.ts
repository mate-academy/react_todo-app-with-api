import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos/', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodo = (todoId: number, fiedsToUpdate: Partial<Todo>) => {
  return client.patch(`/todos/${todoId}`, fiedsToUpdate);
};
