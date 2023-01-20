import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const updateTodo = (
  todoId: number,
  newData: Partial<Todo>,
) => {
  return client.patch(`/todos/${todoId}`, newData);
};
