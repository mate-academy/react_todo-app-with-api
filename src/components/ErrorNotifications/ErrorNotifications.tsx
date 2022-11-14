import React from 'react';
import cn from 'classnames';

import { ErrorType } from '../../types/ErrorType';

interface Props {
  error: ErrorType;
  onCloseError: () => void;
}

export const ErrorNotifications: React.FC<Props> = ({
  error,
  onCloseError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !error.status },
    )}
  >
    <button
      data-cy="HideErrorButton"
      aria-label="delete"
      type="button"
      className="delete"
      onClick={onCloseError}
    />
    {error.message}
  </div>
);
