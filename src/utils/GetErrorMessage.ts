import { ErrorTypes } from '../types/ErrorTypes';

export const getErrorMessage = (error: ErrorTypes) => {
  switch (error) {
    case ErrorTypes.NONE:
      return ErrorTypes.NONE;
    case ErrorTypes.EMPTY_TITLE:
      return ErrorTypes.EMPTY_TITLE;

    case ErrorTypes.ADD_ERROR:
      return ErrorTypes.ADD_ERROR;

    case ErrorTypes.UPLOAD_ERROR:
      return ErrorTypes.UPLOAD_ERROR;

    case ErrorTypes.UPDATE_ERROR:
      return ErrorTypes.UPDATE_ERROR;

    case ErrorTypes.DELETE_ERROR:
      return ErrorTypes.DELETE_ERROR;

    default:
      throw new Error('Unexpected type of error');
  }
};
