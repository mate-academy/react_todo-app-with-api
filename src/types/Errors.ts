export const TodoServiceErrors = {
  Unknown: 'Something whent wrong',
  UnableToLoad: 'Unable to load todos',
  EmptyTitle: 'Title should not be empty',
  UnableToAdd: 'Unable to add a todo',
  UnableToDelete: 'Unable to delete a todo',
  UnableToUpdate: 'Unable to update a todo',
} as const;

export type TodoServiceErrorsValues =
  (typeof TodoServiceErrors)[keyof typeof TodoServiceErrors];
