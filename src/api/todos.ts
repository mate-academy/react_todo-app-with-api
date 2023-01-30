import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const deleteTodoById = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (fieldsToCreate: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', fieldsToCreate);
};

// eslint-disable-next-line max-len
export const updateTodoById = (fieldsToUpdate: Partial<Todo>, todoId: number) => {
  return client.patch<Todo>(`/todos/${todoId}`, fieldsToUpdate);
};
