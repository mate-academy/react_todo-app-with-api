import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../enums/ErrorMessage';

type Props = {
  message: ErrorMessage;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ message, onClose }) => {
  useEffect(() => {
    if (message === ErrorMessage.None) {
      return;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timerId);
  }, [message, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: message === ErrorMessage.None },
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
