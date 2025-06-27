import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

type ErrorMessageProps = {
  errorMessage: ErrorMessages;
  setErrorMessage: (value: React.SetStateAction<ErrorMessages>) => void;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(ErrorMessages.None);
    }, 3000);
  }, [errorMessage, setErrorMessage]);

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
        onClick={() => setErrorMessage(ErrorMessages.None)}
      />
      {errorMessage}
    </div>
  );
};
