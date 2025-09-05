import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  message: ErrorMessage | null;
  onClose: () => void;
};

export const ErrorMassage: React.FC<Props> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) {
      return;
    }

    const id = window.setTimeout(onClose, 3000);

    return () => window.clearTimeout(id);
  }, [message, onClose]);

  const isOpen = Boolean(message);

  return (
    <div
      data-cy="ErrorNotification"
      role="alert"
      aria-live="polite"
      aria-hidden={!isOpen}
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isOpen },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
        aria-label="Hide error"
      />
      {message ?? ''}
    </div>
  );
};
