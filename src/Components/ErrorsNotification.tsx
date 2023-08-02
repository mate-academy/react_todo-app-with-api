import classNames from 'classnames';
import React, { useEffect } from 'react';
import { ErrorType } from '../types/Errors';

type Props = {
  errorMessage: string;
  closeError: (value: ErrorType)=>void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  closeError,
}) => {
  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        closeError(ErrorType.none);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return () => {};
  }, [errorMessage]);

  return (
    <div className={
      classNames('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })
    }
    >

      <button
        type="button"
        className="delete"
        onClick={() => closeError}
        aria-label="closeBtn"
      />

      {errorMessage}

    </div>
  );
};
