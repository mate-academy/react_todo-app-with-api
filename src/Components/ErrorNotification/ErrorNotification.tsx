import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { ErrorType } from '../../enums/ErrorType';
import { errorMessages } from '../../utils/ErrorMessages';

type Props = {
  errorType: ErrorType;
  onCloseNotification: () => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  errorType,
  onCloseNotification,
}) => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    errorMessages(errorType, setErrorMessage);
  }, [errorType]);

  useEffect(() => {
    const timerId = setTimeout(() => onCloseNotification(), 3000);

    return () => clearTimeout(timerId);
  });

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
        className={classNames('delete', {
          hidden: errorType === ErrorType.None,
        })}
        onClick={onCloseNotification}
        aria-label="Close notification about an error"
      />

      {errorMessage === ErrorType.EmptyTitle ? (
        'Title can\'t be empty'
      ) : (
        `Unable to ${errorMessage} a todo`
      )}
    </div>
  );
});
