import cn from 'classnames';
import { TodoError } from '../../types/TodoError';
import { useEffect } from 'react';

type Props = {
  error: string | null;
  setError: (error: TodoError | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
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
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};
