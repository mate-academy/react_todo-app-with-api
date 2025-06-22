/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../types/messages';

interface ErrorNotificationProps {
  errorMessage: ErrorMessages;
  setErrorMessage: (message: ErrorMessages) => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorMessage === ErrorMessages.None },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessages.None)}
        aria-label="Hide error notification"
      />
      {errorMessage}
    </div>
  );
};
