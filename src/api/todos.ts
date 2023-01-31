import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`) || null;
};

export const createTodo = (fieldsToCreate: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', fieldsToCreate);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
) => {
  return client.patch(`/todos/${todoId}`, fieldsToUpdate);
};
