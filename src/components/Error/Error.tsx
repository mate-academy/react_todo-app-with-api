/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import cn from 'classnames';
import { TodoContext } from '../../context/TodoContext';

export const Error: React.FC = () => {
  const { errorMessage, handleError } = useContext(TodoContext);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    timeoutId = setTimeout(() => {
      handleError('');
    }, 3000);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
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
