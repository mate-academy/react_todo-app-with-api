import React from 'react';
import { ErrorMessages } from '../types/messages';  // Переконайтеся, що ви імпортуєте правильно

interface ErrorNotificationProps {
  errorMessage: ErrorMessages;  // Тип errorMessage має бути ErrorMessages
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessages>>;  // Тип setErrorMessage має бути правильним
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ errorMessage, setErrorMessage }) => {
  return (
    <div
      className={`notification is-danger is-light has-text-weight-normal ${errorMessage === ErrorMessages.None ? 'hidden' : ''}`}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessages.None)}  // Оновлення помилки на "None"
      />
      {errorMessage}
    </div>
  );
};

export default ErrorNotification;
