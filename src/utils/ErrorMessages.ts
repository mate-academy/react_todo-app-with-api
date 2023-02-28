import { ErrorType } from '../enums/ErrorType';

export function errorMessages(
  message: ErrorType,
  callback: (message: ErrorType) => void,
) {
  switch (message) {
    case ErrorType.Add:
      callback(message);

      break;
    case ErrorType.Delete:
      callback(message);

      break;
    case ErrorType.Update:
      callback(message);

      break;
    case ErrorType.Download:
      callback(message);

      break;

    default:
      break;
  }
}
