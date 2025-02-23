import { useContext, useEffect } from 'react';
import cn from 'classnames';

import { TodoContext } from '../../contexts/TodoContext';

export const ErrorMessage = () => {
  const { errorMessage, setErrorHandler } = useContext(TodoContext);

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setErrorHandler('');
    }, 3000);

    return () => clearTimeout(errorTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorHandler('')}
      />
      {errorMessage}
    </div>
  );
};
