import React from 'react';
import cn from 'classnames';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotificationProps } from './types/ErrorNotificationProps';

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  handleErrorNotificationClick,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={
        cn('notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal', {
            hidden: errorMessage === ErrorMessage.None,
          })
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorNotificationClick}
        aria-label="Close error message"
      />
      {errorMessage}
    </div>
  );
};
