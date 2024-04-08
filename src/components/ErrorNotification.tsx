import React, { useEffect } from 'react';

import { useError } from './context/ErrorContext';

import cn from 'classnames';
import { TodoError } from '../types/enums';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useError();

  useEffect(() => {
    const delay = setTimeout(() => {
      setErrorMessage(TodoError.NoError);
    }, 3000);

    return () => clearTimeout(delay);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(TodoError.NoError)}
      />
      {errorMessage}
    </div>
  );
};
