import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../utils/errorMessages';

type Props = {
  setErrorMessage: (value: ErrorMessage) => void;
  errorMessage: ErrorMessage;
};

export const ErrorNotification: React.FC<Props> = ({
  setErrorMessage,
  errorMessage,
}) => {
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setErrorMessage(ErrorMessage.Default);
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorMessage === ErrorMessage.Default },
      )}
    >
      <button
        aria-label="hideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.Default)}
      />
      {errorMessage}
    </div>
  );
};
