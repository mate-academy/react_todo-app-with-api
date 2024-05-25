import { ErrorType } from './ErrorTypes';

export interface Error {
  type: ErrorType;
  textError: string;
  value: boolean;
}
