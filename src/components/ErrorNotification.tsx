import { useEffect } from 'react';
import classNames from 'classnames';
import { TodoError } from '../types/typedefs';

interface ErrorNotificationProps {
  error: TodoError | null;
  onClearError: () => void;
}

const ERROR_DURATION = 3000;

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onClearError,
}) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      onClearError();
    }, ERROR_DURATION);

    return () => clearTimeout(timer);
  }, [error, onClearError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClearError}
      />
      {error}
    </div>
  );
};
