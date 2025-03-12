import React from 'react';
import cn from 'classnames';

interface ErrorNotificationProps {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        { hidden: !errorMessage.trim() },
        'notification is-danger is-light has-text-weight-normal',
      )}
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
