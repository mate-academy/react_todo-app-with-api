/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useRef } from 'react';

import { TodosContext } from '../../TodosContext';

import { Error } from '../../types/Error';

export const Notification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (errorMessage !== Error.Absent) {
      timeoutRef.current = window.setTimeout(
        () => setErrorMessage(Error.Absent), 3000,
      );
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Error.Absent)}
      />

      {errorMessage !== Error.Absent && errorMessage}
    </div>
  );
};
