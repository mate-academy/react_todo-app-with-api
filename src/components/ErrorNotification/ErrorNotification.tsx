import classNames from 'classnames';
import React, { useEffect } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  message: ErrorMessage;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ message, onClose }) => {
  useEffect(() => {
    if (message === ErrorMessage.Default) {
      return;
    }

    const timer = setTimeout(onClose, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !message },
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
