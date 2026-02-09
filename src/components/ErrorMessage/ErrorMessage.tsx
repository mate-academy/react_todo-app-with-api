import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  message: ErrorMessages;
  onClose: () => void;
};

export const ErrorMessage: React.FC<Props> = ({ message, onClose }) => {
  useEffect(() => {
    if (message === ErrorMessages.None) {
      return;
    }

    const timerId = window.setTimeout(onClose, 3000);

    return () => window.clearTimeout(timerId);
  }, [message, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: message === ErrorMessages.None },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {message}
    </div>
  );
};
