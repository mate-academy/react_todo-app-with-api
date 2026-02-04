import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  message: string;
  onClose: () => void;
};

export const Notification: React.FC<Props> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timerId = setTimeout(() => onClose(), 3000);

    return () => clearTimeout(timerId);
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
