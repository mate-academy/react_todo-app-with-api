import { ErrorMessage } from '../../types/ErrorMessage';

export const errorString = (errorMessage: string) => {
  switch (errorMessage) {
    case ErrorMessage.Add:
    case ErrorMessage.Download:
    case ErrorMessage.Delete:
    case ErrorMessage.Update:
      return `Unable to ${errorMessage} a todo`;
    case ErrorMessage.EmptyTitle:
      return 'Title can\'t be empty';
    default:
      return '';
  }
};
