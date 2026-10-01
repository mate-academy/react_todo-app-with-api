export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export const enum Status {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const enum ErrorMsg {
  Loading = 'Unable to load todos',
  Adding = 'Unable to add a todo',
  EmptyTitle = 'Title should not be empty',
  Deleting = 'Unable to delete a todo',
  Updating = 'Unable to update a todo',
}
