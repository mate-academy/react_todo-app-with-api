import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  onClose: () => void;
  duration?: number;
};

export const WarningError: React.FC<Props> = ({
  errorMessage,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [errorMessage, onClose, duration]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
