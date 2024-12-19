import { FC } from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../types/enums';

interface ErrorNotificationProps {
  error: ErrorMessages;
  onHideError: () => void;
}

export const ErrorNotification: FC<ErrorNotificationProps> = ({
  error,
  onHideError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHideError}
      />
      {error}
    </div>
  );
};
