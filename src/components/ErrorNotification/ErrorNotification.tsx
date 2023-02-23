import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';
import { errorMessage } from '../../helpers';

type Props = {
  errorType: ErrorType;
  onNotificationClose: () => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  errorType,
  onNotificationClose,
}) => {
  const errorText = errorMessage(errorType);

  useEffect(() => {
    const timerId = setTimeout(() => onNotificationClose(), 3000);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: errorType === ErrorType.None,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={onNotificationClose}
        aria-label="Close notification about an error"
      />
      {errorText}
    </div>
  );
});
