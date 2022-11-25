import { ErrorType } from '../types/ErrorType';

export const manageErrors = (errorType: ErrorType) => {
  switch (errorType) {
    case ErrorType.Endpoint:
      return 'Fetch error';

    case ErrorType.Title:
      return 'Title can`t be empty';

    case ErrorType.Add:
      return 'Unable to add a todo';

    case ErrorType.Delete:
      return 'Unable to delete a todo';

    case ErrorType.Update:
      return 'Unable to update a todo';

    default:
      return '';
  }
};
