export const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const ERROR_MESSAGES = {
  load: 'Unable to load todos',
  add: 'Unable to add a todo',
  delete: 'Unable to delete a todo',
  update: 'Unable to update a todo',
  emptyTitle: 'Title should not be empty',
} as const;

export const ERROR_HIDE_DELAY = 3000;
