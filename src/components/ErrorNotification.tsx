import classNames from 'classnames';
import React from 'react';

interface ErrorNotificationProps {
  errorMessage: string | null;
  onHideError: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  onHideError,
}) => {
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
        onClick={onHideError}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
