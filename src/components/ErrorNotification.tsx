import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ERROR_DISPLAY_DURATION } from '../constants';

interface Props {
  error: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {
  useEffect(() => {
    if (!error) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, ERROR_DISPLAY_DURATION);

    return () => clearTimeout(timerId);
  }, [error, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {error}
    </div>
  );
};
