import cn from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';
import React from 'react';

type ErrorNotificationProps = {
  errorMessage: ErrorMessage;
  onSetErrorMessage: (error: ErrorMessage) => void;
};

export const ErrorNotification = React.memo(
  ({ errorMessage, onSetErrorMessage }: ErrorNotificationProps) => {
    return (
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage === ErrorMessage.WithoutError,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => onSetErrorMessage(ErrorMessage.WithoutError)}
        />
        {errorMessage}
      </div>
    );
  },
);

ErrorNotification.displayName = 'ErrorNotification';
