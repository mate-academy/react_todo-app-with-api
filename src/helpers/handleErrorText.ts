import { ErrorTypes } from '../types/ErrorTypes';

export const handleErrorText = (error: ErrorTypes) => {
  switch (error) {
    case ErrorTypes.LOAD_ALL_TODOS:
      return 'Unable to load todos';

    case ErrorTypes.TITLE:
      return 'Title should not be empty';

    case ErrorTypes.ADD_TODO:
      return 'Unable to add a todo';

    case ErrorTypes.DELETE_TODO:
      return 'Unable to delete a todo';

    case ErrorTypes.UPDATE_TODO:
      return 'Unable to update a todo';

    default:
      return null;
  }
};
