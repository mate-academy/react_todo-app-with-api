import React from 'react';
import { Errors } from '../../types/Errors';
import cn from 'classnames';

type Props = {
  error: Errors;
  onHideError: () => void;
};

export const Error: React.FC<Props> = ({ error, onHideError }) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: error === Errors.NoError,
      },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onHideError}
    />
    {error}
  </div>
);
