import React from 'react';
import classNames from 'classnames';

import { Error } from '../../types/Error';

interface Props {
  error: Error;
  onCloseError: () => void;
}

export const ErrorMessages: React.FC<Props> = ({
  error,
  onCloseError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
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
