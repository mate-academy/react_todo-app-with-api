import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3059;

export enum TodosError {
  unableToLoad = 'Unable to load todos',
  titleNotEmpty = 'Title should not be empty',
  unableToAdd = 'Unable to add a todo',
  unableToDelete = 'Unable to delete a todo',
  unableToUpdate = 'Unable to update a todo',
}

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos/`, { userId, title, completed });
};

export const updateTodos = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};
