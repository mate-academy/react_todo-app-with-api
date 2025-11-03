import React from 'react';
import classNames from 'classnames';

interface ErrorNotificationProps {
  errorMessage: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  onClose,
}) => {
  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseClick}
      />
      {errorMessage}
    </div>
  );
};
