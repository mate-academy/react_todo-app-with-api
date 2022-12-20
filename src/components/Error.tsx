import classNames from 'classnames';
import React from 'react';
import { Errors } from '../types/Errors';

interface Props {
  error: null | string,
  onRemoveError: () => void,
}

export const Error: React.FC<Props> = React.memo(({ error, onRemoveError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: error === Errors.NONE,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onRemoveError}
      />
      {error}
    </div>
  );
});
