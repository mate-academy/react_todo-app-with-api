import React, { useCallback } from 'react';
import cn from 'classnames';
import { useNotification } from '../contexts/NotificationContext';

export const ErrorNotification: React.FC = () => {
  const { message, isVisible, hideNotification } = useNotification();

  const onClose = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      hideNotification();
    },
    [hideNotification],
  );

  return (
    <div
      role="alert"
      aria-live="polite"
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isVisible },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onMouseDown={onClose}
        onClick={onClose}
        aria-label="Close notification"
      />
      {message}
    </div>
  );
};
