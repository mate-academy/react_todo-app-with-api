import { ErrorMessages } from '../enums/ErrorMessages';

export interface ErrorState {
  message: ErrorMessages;
  isVisible: boolean;
}
