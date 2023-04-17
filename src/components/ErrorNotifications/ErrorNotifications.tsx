import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage,
  closeError: () => void,
};

export const ErrorNotifications: React.FC<Props> = ({
  errorMessage,
  closeError,
}) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      closeError();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [closeError]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={closeError}
      >
        ×
      </button>

      {errorMessage}
    </div>
  );
};
