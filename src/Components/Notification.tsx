import React, { useEffect } from 'react';
import classNames from 'classnames';

interface NotificationPropsType {
  hasError: boolean,
  errorMessage: string,
  clearError: () => void,
}

export const Notification: React.FC<NotificationPropsType> = ({
  hasError,
  errorMessage,
  clearError,
}) => {
  useEffect(() => {
    setInterval(clearError, 3000);
  }, [errorMessage]);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !hasError },
    )}
    >

      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={clearError}
      />
      {errorMessage}
    </div>
  );
};
