import React from 'react';
import cn from 'classnames';
import { useTodosContext } from '../TodosContext';

export const ErrorNotification: React.FC = () => {
  const {
    setErrorMessage,
    errorMessage,
  } = useTodosContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="Hidden error button"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
