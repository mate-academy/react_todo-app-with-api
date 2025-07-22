export const TodoServiceErrors = {
  Unknown: 'Something went wrong',
  UnableToLoad: 'Unable to load todos',
  TitleShouldNotBeEmpty: 'Title should not be empty',
  UnableToAdd: 'Unable to add a todo',
  UnableToDelete: 'Unable to delete a todo',
  UnableToUpdate: 'Unable to update a todo',
} as const;

export type TodoError =
  (typeof TodoServiceErrors)[keyof typeof TodoServiceErrors];
