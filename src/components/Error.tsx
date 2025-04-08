import cn from 'classnames';
import { FC, useEffect } from 'react';
import { ErrorMessages } from '../utils/errorMessageEnum';

type Props = {
  error: string;
  setError: (error: ErrorMessages) => void;
};

export const Error: FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(ErrorMessages.Default);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorMessages.Default)}
      />
      {error}
    </div>
  );
};
