import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = async (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const updateTodo = async (
  todoId: number,
  newData: Partial<Todo>,
) => {
  return client.patch(`/todos/${todoId}`, newData);
};
