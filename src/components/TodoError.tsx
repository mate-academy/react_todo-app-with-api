/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import cn from 'classnames';
import { TodoContext } from './TodoContex';

const TodoError : React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification', 'is-danger', 'is-light',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};

export default TodoError;
