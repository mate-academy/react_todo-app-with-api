import { ErrorMessages } from '../types/ErrorMessages';

export const chooseTheError = (errorType: ErrorMessages) => {
  switch (errorType) {
    case ErrorMessages.LOAD:
      return 'Unable to load todos';

    case ErrorMessages.TITLE:
      return 'Title can\'t be empty';

    case ErrorMessages.ADD:
      return 'Unable to add the todo';

    case ErrorMessages.DELETE:
      return 'Unable to delete the todo';

    case ErrorMessages.DELETE_COMPLETED:
      return 'Unable to delete completed todos';

    case ErrorMessages.UPDATE:
      return 'Unable to update a todo';

    case ErrorMessages.UPDATE_ALL:
      return 'Unable to update status of todos';

    default:
      throw new Error('No such error');
  }
};
