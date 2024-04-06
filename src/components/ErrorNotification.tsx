import React from 'react';
import classNames from 'classnames';
import { useTodosContext } from '../context/useTodosContext';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, handleError } = useTodosContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleError('')}
      />
      {errorMessage}
    </div>
  );
};
