import React, { useEffect } from 'react';
import { ErrorStatus } from '../types/ErrorStatus';
import cn from 'classnames';

type Props = {
  error: string;
  setError: React.Dispatch<React.SetStateAction<ErrorStatus>>;
};

export const ErrorNotification: React.FC<Props> = props => {
  const { error, setError } = props;

  useEffect(() => {
    if (error === ErrorStatus.Empty) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(ErrorStatus.Empty);
    }, 3000);

    return () => {
      clearInterval(timerId);
    };
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorStatus.Empty)}
      />
      {error}
    </div>
  );
};
