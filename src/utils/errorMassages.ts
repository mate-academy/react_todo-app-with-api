import { ErrorType } from '../types/ErrorType';

export function errorMassages(
  massage: ErrorType,
  callback: (massage: ErrorType
  ) => void,
) {
  switch (massage) {
    case ErrorType.UPLOAD_ERROR:
      callback(massage);
      break;

    case ErrorType.ADD_ERROR:
      callback(massage);
      break;

    case ErrorType.DELETE_ERROR:
      callback(massage);
      break;

    case ErrorType.UPDATE_ERROR:
      callback(massage);
      break;

    case ErrorType.TITLE_ERROR:
      callback(massage);
      break;

    case ErrorType.NONE:
      break;

    default:
      throw new Error('Unexpected error type');
  }
}
