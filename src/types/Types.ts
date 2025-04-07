export enum ErrorType {
  NONE = '',
  TODO_LOAD = 'Unable to load todos',
  TITLE_EMPTY = 'Title should not be empty',
  TODO_ADD = 'Unable to add a todo',
  TODO_UPDATE = 'Unable to update a todo',
  TODO_DELETE = 'Unable to delete a todo',
  TODO_PROCESSED = 'Todo are processed now. Please try again later',
}

export enum FilterBy {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
