import React from 'react';
import classNames from 'classnames';

interface ErrorNotificationProps {
  error: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onClose,
}) => {
  if (!error) return null;

  return (
    <div
      className={classNames('notification', 'is-danger', 'is-light')}
      data-cy="ErrorNotification"
    >
      <button
        type="button"
        className="delete"
        onClick={onClose}
        data-cy="HideErrorButton"
      />
      {error}
    </div>
  );
};
