import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  const newTodo = await client.post<Todo>('/todos', todo);

  return newTodo;
};

export const deleteTodo = async (todoId: number) => {
  await client.delete(`/todos/${todoId}`);
};

export const updatingTodo = async (todoId: number, upgrade: Partial<Todo>) => {
  const upatedTodo = await client.patch(`/todos/${todoId}`, upgrade);

  return upatedTodo;
};
