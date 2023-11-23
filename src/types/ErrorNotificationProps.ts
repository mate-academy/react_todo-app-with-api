import { ErrorMessage } from './ErrorMessage';

export interface ErrorNotificationProps {
  errorMessage: ErrorMessage;
  handleErrorNotificationClick: () => void;
}
