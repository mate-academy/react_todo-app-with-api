import { FC, useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../../enums/ErrorMessages';

const ERROR_DURATION = 3000;

interface ErrorNotificationProps {
  errorMessage: ErrorMessages | null;
  onHideError: () => void;
}

export const ErrorNotification: FC<ErrorNotificationProps> = ({
  errorMessage,
  onHideError,
}) => {
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        onHideError();
      }, ERROR_DURATION);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage, onHideError]);

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
        onClick={() => onHideError()}
      />
      {errorMessage}
    </div>
  );
};
