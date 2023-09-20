import classNames from 'classnames';
import React, { useContext } from 'react';
import { ErrorContext } from '../ErrorContext';

export const TodoError: React.FC = () => {
  const { error, setError } = useContext(ErrorContext);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        aria-label="delete-error-button"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />

      {error}
    </div>
  );
};
