import React, { useEffect } from 'react';
import classNames from 'classnames';
import { TextError } from '../../types/TextError';

type Props = {
  error: TextError;
  setError: (errorMessage: TextError | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  const closeError = () => {
    setError(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, (3000));

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === null },
      )}

    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="closeError"
        onClick={closeError}
      />
      {error}
    </div>
  );
};
