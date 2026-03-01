import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../types/ErrorMessages';

interface Props {
  error: ErrorMessages | null;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(onClose, 3000);

    return () => clearTimeout(timer);
  }, [error, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
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
