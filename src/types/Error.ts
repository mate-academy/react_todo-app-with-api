export const enum StatusError {
  GET = 'Unable to load todos',
  POST = 'Unable to add a todo',
  DELETE = 'Unable to delete a todo',
  UPDATE = 'Unable to update a todo',
}

export const enum ValidationError {
  EMPTY_TITLE = 'Title should not be empty',
}

export type AppError = StatusError | ValidationError;
