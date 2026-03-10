import React from 'react';
import classNames from 'classnames';

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification is-danger is-light', {
        hidden: !message,
      })}
    >
      <button
        data-cy="HideErrorButton"
        className="delete"
        onClick={onClose}
      />
      {message}
    </div>
  );
};
