export const TIMEOUTS = {
  ERROR_MESSAGE_TIMEOUT: 3000,
  API_DELAY: 100,
} as const;

export const ERROR_MESSAGES = {
  LOAD_TODOS: 'Unable to load todos',
  ADD_TODO: 'Unable to add a todo',
  UPDATE_TODO: 'Unable to update a todo',
  DELETE_TODO: 'Unable to delete a todo',
  EMPTY_TITLE: 'Title should not be empty',
} as const;

export const API_CONFIG = {
  BASE_URL: 'https://mate.academy/students-api',
  MAX_RETRIES: 0,
  RETRY_DELAY: 1000,
} as const;
