import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

const createTodo = (fieldsToCreate: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', fieldsToCreate);
};

const updateTodo = (
  todoId: number,
  fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, fieldsToUpdate);
};

export const todoApi = {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
};
