import classNames from 'classnames';
import { useEffect } from 'react';

type ErrorNotificationProps = {
  errorMessage: string;
  resetError: () => void;
};

export function ErrorNotification({
  errorMessage,
  resetError,
}: ErrorNotificationProps) {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      resetError();
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage, resetError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={resetError}
      />
      {errorMessage}
    </div>
  );
}
