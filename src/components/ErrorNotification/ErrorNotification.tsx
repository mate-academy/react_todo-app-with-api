import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { ErrorType } from '../../enums/ErrorType';

type Props = {
  errorType: ErrorType;
  isErrorShown: boolean;
  onCloseNotification: () => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(
  ({ errorType, isErrorShown, onCloseNotification }) => {
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
      switch (errorType) {
        case ErrorType.Add:
        case ErrorType.Delete:
        case ErrorType.Update:
        case ErrorType.Download:
          setErrorMessage(`Unable to ${errorType} a todo`);

          break;

        case ErrorType.EmptyTitle:
          setErrorMessage("Title can't be empty");

          break;

        default:
          setErrorMessage('');
      }
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
            hidden: !isErrorShown,
          },
        )}
      >
        <button
          type="button"
          className={classNames('delete', {
            hidden: !isErrorShown,
          })}
          onClick={onCloseNotification}
          aria-label="Close notification about an error"
        />

        {errorMessage}
      </div>
    );
  },
);
