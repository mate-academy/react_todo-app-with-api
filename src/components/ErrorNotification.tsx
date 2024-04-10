import React, { useEffect } from 'react';
import cn from 'classnames';

interface ErrorNotificationProps {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage, setErrorMessage]);

  if (!errorMessage) {
    return null;
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};

export default ErrorNotification;
