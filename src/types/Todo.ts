export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum ErrorMessages {
  NO_ERROR = '',
  ERROR_LOAD_TODOS = 'Unable to load todos',
  ERROR_NO_TITLE = 'Title should not be empty',
  ERROR_ADD_TODO = 'Unable to add a todo',
  ERROR_DELETE_TODO = 'Unable to delete a todo',
  ERROR_UPDATE_TODO = 'Unable to update a todo',
}

export enum StatusTodos {
  COMPLETED = 'Completed',
  ACTIVE = 'Active',
  ALL = 'All',
}
