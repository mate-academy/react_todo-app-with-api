import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorTypes } from '../../types/PossibleError';
import { errorMessage } from '../../utils/functions';

type Props = {
  possibleError: ErrorTypes;
  onErrorNotificationClose: () => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  possibleError,
  onErrorNotificationClose,
}) => {
  const errorText = errorMessage(possibleError);

  useEffect(() => {
    const timerId = setTimeout(() => onErrorNotificationClose(), 3000);

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
          hidden: possibleError === ErrorTypes.None,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={onErrorNotificationClose}
        aria-label="Close notification about an error"
      />
      {errorText}
    </div>
  );
});
