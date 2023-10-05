import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  errorMessage: ErrorMessage,
  setErrorMessage: (newErrorMessage: ErrorMessage) => void,
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (errorMessage) {
      timerRef.current = window.setTimeout(() => {
        setErrorMessage(ErrorMessage.Default);
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [errorMessage]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      data-cy="ErrorNotification"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="delete"
        onClick={() => setErrorMessage(ErrorMessage.Default)}
      />
      {errorMessage}
    </div>
  );
};
