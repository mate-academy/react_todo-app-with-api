import { FC, useEffect } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/Error';

interface NotificationProps {
  error: ErrorType;
  onRemoveError: () => void;
  setError: (error: ErrorType) => void;
}

export const ErrorNotification: FC<NotificationProps> = ({
  error,
  onRemoveError,
  setError,
}) => {
  useEffect(
    () => {
      setTimeout(() => setError(ErrorType.NONE),
        3000);
    }, [error],
  );

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal', {
        hidden: !error,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="close the notification"
        onClick={onRemoveError}
      />
      {error}
    </div>
  );
};
