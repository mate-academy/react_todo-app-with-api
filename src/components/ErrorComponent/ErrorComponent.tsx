import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../../contexts/TodoContext';

export const ErrorComponent: React.FC = () => {
  const { dataError, setError } = useContext(TodoContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !dataError },
      )}
    >
      {dataError}
      <button
        aria-label="X"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
    </div>
  );
};
