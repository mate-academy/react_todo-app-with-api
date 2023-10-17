/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../contexts/TodoContext';

export const Error: React.FC = () => {
  const { error, setError } = React.useContext(TodoContext);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => setError(null), 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !error },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />

      {error}
    </div>
  );
};
