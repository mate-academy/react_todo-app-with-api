export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  isLoaded?: boolean;
}

export enum FilterStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export enum Errors {
  GET = 'Unable to load todos',
  EMPTY = 'Title should not be empty',
  POST = 'Unable to add a todo',
  DELETE = 'Unable to delete a todo',
  PATCH = 'Unable to update a todo',
}

export const handleError = (err: unknown): string => {
  if (err instanceof Error) {
    return err?.message;
  }

  return 'An unexpected error occurred.';
};
