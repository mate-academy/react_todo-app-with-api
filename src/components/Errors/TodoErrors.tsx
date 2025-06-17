import classNames from 'classnames';
import React, { useEffect } from 'react';
import { TodoTypeError } from '../../types/TodoTypeErrors';

type Props = {
  error: TodoTypeError | null;
  setError: (error: TodoTypeError | null) => void;
};

export const TodoErrors: React.FC<Props> = ({ error, setError }) => {
  // Hide error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError(null);
        }}
      />
      {error}
    </div>
  );
};
