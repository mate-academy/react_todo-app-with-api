export const ErrorMessages = {
  Load: 'Unable to load todos',
  Title: 'Title should not be empty',
  Add: 'Unable to add a todo',
  Delete: 'Unable to delete a todo',
  Update: 'Unable to update a todo',
};

export type ErrorMessage =
  | typeof ErrorMessages.Load
  | typeof ErrorMessages.Title
  | typeof ErrorMessages.Add
  | typeof ErrorMessages.Delete
  | typeof ErrorMessages.Update;

export type FilterBy = 'all' | 'active' | 'completed';
