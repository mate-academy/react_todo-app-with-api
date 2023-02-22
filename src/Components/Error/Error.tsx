import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage;
  onErrorClose: () => void;
};

export const Error: React.FC<Props> = React.memo(
  ({ errorMessage, onErrorClose }) => {
    const [errorString, setErrorString] = useState('');

    useEffect(() => {
      switch (errorMessage) {
        case ErrorMessage.Add:
        case ErrorMessage.Download:
        case ErrorMessage.Delete:
        case ErrorMessage.Update:
          setErrorString(`Unable to ${errorMessage} a todo`);
          break;
        case ErrorMessage.EmptyTitle:
          setErrorString("Title can't be empty");
          break;
        default:
          break;
      }
    }, [errorMessage]);

    useEffect(() => {
      const timerId = setTimeout(() => onErrorClose(), 3000);

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
            hidden: errorMessage === ErrorMessage.None,
          },
        )}
      >
        <button
          type="button"
          className={classNames('delete', {
            hidden: errorMessage === ErrorMessage.None,
          })}
          onClick={onErrorClose}
          aria-label="Close error message"
        />

        {errorString}
      </div>
    );
  },
);
