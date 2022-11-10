import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  error: Errors,
  setError: (error: Errors) => void,
};

export const TodoError: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(Errors.None);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

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
        aria-label="delete"
        onClick={() => setError(Errors.None)}
      />
      <span>{error}</span>
    </div>
  );
};
