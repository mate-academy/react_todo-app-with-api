export enum Error {
  None = '',
  Load = 'Unable to load todos',
  Add = 'Unable to add todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
  EmptyTitle = 'Title can\'t be empty',
}

export const getErrorMessage = (errorType: Error) => {
  switch (errorType) {
    case Error.Load:
      return 'Unable to load todos';
    case Error.Add:
      return 'Unable to add todo';
    case Error.Delete:
      return 'Unable to delete a todo';
    case Error.Update:
      return 'Unable to update a todo';
    case Error.EmptyTitle:
      return 'Title can\'t be empty';
    default:
      return 'An error occurred';
  }
};
