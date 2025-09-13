import cn from 'classnames';
import React, { useEffect } from 'react';

interface Props {
  message: string;
  onHide: () => void;
}

export const Notification: React.FC<Props> = ({ message, onHide }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [message, onHide]);

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
        onClick={onHide}
      />
      {message}
    </div>
  );
};
