/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Errors } from '../types/Errors';

const ERROR_MESSAGES: Record<Errors, string> = {
  [Errors.LoadError]: Errors.LoadError,
  [Errors.EmptyTitle]: Errors.EmptyTitle,
  [Errors.AddTodoError]: Errors.AddTodoError,
  [Errors.DeleteTodoError]: Errors.DeleteTodoError,
  [Errors.UpdateTodoError]: Errors.UpdateTodoError,
};

interface Props {
  error: Errors | '';
  setError: (value: Errors | '') => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  const errorMessage = useMemo(() => ERROR_MESSAGES[error as Errors]
  || '', [error]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (error !== '') {
        setError('');
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [error, setError]);

  const resetError = () => {
    setError('');
  };

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
        onClick={resetError}
      />
      {errorMessage}
    </div>
  );
};
