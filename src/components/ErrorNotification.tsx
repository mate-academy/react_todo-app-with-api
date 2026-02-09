import React, { useEffect } from 'react';
import cn from 'classnames';
import { ERRORS } from '../utils/errors';

interface ErrorNotificationProps {
  message: ERRORS;
  onClose: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  onClose,
}) => {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [message, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !message,
      })}
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
