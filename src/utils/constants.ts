export enum TodoStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const ERROR_MESSAGES = {
  LOAD_TODOS: 'Unable to load todos',
  ADD_TODO: 'Unable to add a todo',
  DELETE_TODO: 'Unable to delete a todo',
  UPDATE_TODO: 'Unable to update a todo',
  EMPTY_TITLE: 'Title should not be empty',
};

export const errorDelay = 3000;
