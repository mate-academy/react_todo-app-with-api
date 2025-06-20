import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3098;

export const TodoServiceError = {
  Unknown: 'Something when wrong with todos',
  UnableToLoad: 'Unable to load todos',
  TitleShouldNotBeEmpty: 'Title should not be empty',
  UnableToAdd: 'Unable to add a todo',
  UnableToDelete: 'Unable to delete a todo',
  UnableToUpdate: 'Unable to update a todo',
} as const;

export type TodoError =
  (typeof TodoServiceError)[keyof typeof TodoServiceError];

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const updateTodo = (todoId: Todo['id'], todo: Omit<Todo, 'id'>) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};
