import { ErrorMessage } from '../types/ErrorEnum';

export const renderSwitch = (err: ErrorMessage) => {
  switch (err) {
    case ErrorMessage.ADD:
      return ErrorMessage.ADD;
    case ErrorMessage.EMPTY:
      return ErrorMessage.EMPTY;
    case ErrorMessage.SERVER:
      return ErrorMessage.SERVER;
    case ErrorMessage.DELETE:
      return ErrorMessage.DELETE;
    case ErrorMessage.UPDATE:
      return ErrorMessage.UPDATE;
    default:
      return ErrorMessage.NONE;
  }
};
