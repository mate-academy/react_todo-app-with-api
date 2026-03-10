export enum ErrorEnum {
  LOADING = 'Unable to load todos',
  EMPTY = 'Title should not be empty',
  ADD = 'Unable to add a todo',
  DELETE = 'Unable to delete a todo',
  UPDATE = 'Unable to update a todo',
}

export interface ErrorType {
  type: ErrorEnum;
  errorAmount: number;
}
