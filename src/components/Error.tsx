/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import cn from 'classnames';
import { useTodoContext } from '../contexts/TodoContext';


export const Error: React.FC= () => {
  const { error, setError } = useTodoContext();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  return (
    <div className={cn(
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