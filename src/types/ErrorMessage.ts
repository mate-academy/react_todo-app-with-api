export type ErrorMessage = {
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
};

export enum Error {
  ADD_TODO = 'Unable to add a todo',
  EMPTY_TITLE = 'Title should not be empty',
  LOAD_TODOS = 'Unable to load todos',
  UPDATE_TODO = 'Unable to update a todo',
  DELETE = 'Unable to delete a todo',
}
