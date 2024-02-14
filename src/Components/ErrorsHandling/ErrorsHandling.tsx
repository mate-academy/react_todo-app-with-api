/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect,
} from 'react';
import cn from 'classnames';
import { TodoContext } from '../../TodoContext';

export const ErrorsHandling: React.FC = React.memo(() => {
  const {
    error,
    setError,
  } = useContext(TodoContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError('');
        }}
      />
      {error}
    </div>
  );
});
