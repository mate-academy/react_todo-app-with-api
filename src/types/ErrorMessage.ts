export const ERROR_MESSAGES = {
  LOAD: 'Unable to load todos',
  TITLE: 'Title should not be empty',
  ADD: 'Unable to add a todo',
  DELETE: 'Unable to delete a todo',
  UPDATE: 'Unable to update a todo',
} as const;

export type ErrorMessageType =
  (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
