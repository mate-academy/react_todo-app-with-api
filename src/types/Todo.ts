export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type FilterType = 'All' | 'Active' | 'Completed';

export enum ErrorType {
  EmptyTitle = 'Title should not be empty',
  UnableToAddTodo = 'Unable to add a todo',
  UnableToDeleteTodo = 'Unable to delete a todo',
  UnableToUpdateTodo = 'Unable to update a todo',
  UnableToLoadTodos = 'Unable to load todos',
}
