import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  errorMessage: ErrorMessage;
  setErrorMessage: (message: ErrorMessage) => void;
}

export const ErrorNotification: React.FC<Props> = React.memo(
  ({ errorMessage, setErrorMessage }) => {
    useEffect(() => {
      if (!errorMessage) {
        return;
      }

      const timer = setTimeout(() => {
        setErrorMessage(ErrorMessage.Default);
      }, 3000);

      return () => clearTimeout(timer);
    }, [errorMessage, setErrorMessage]);

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
          onClick={() => setErrorMessage(ErrorMessage.Default)}
        />
        {errorMessage}
      </div>
    );
  },
);

ErrorNotification.displayName = 'ErrorNotification';
