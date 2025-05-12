import React, { useEffect } from 'react';
import classNames from 'classnames';

type ErrorNotificationsProps = {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorNotifications: React.FC<ErrorNotificationsProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const errorTimeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(errorTimeout);
  }, [errorMessage, setErrorMessage]);

  const handleDismissError = () => {
    setErrorMessage('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleDismissError}
        aria-label="Dismiss error"
      />
      {errorMessage}
    </div>
  );
};
