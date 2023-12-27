import React from 'react';
import cn from 'classnames';
import { useTodosContext } from '../store';

export const ErrorNotification: React.FC = () => {
  const {
    hasError,
    resetHasError,
  } = useTodosContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !hasError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="hideErrorBtn"
        type="button"
        className="delete"
        onClick={resetHasError}
      />
      {hasError}
    </div>
  );
};
