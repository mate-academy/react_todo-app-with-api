import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoUpdateData } from '../types/TodoUpdateData';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post('/todos', data);
};

export const updateTodo = (
  todoId: number,
  data: TodoUpdateData,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
