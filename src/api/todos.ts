import { client } from '../utils/fetchClient';

import { Todo } from '../types/Todo';

export const getTodos = async (userId: number) => {
  const todos = await client.get<Todo[]>(`/todos?userId=${userId}`);

  return todos;
};

export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  const newTodo = await client.post<Todo>('/todos', todo);

  return newTodo;
};

export const removeTodo = async (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = async (
  todoId: number, updatedTodo: Partial<Todo>,
) => {
  return client.patch(`/todos/${todoId}`, updatedTodo);
};
