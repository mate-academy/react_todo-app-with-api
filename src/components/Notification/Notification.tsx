import React, { useContext, useEffect } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosProvider';

export const Notification: React.FC = React.memo(() => {
  const {
    hasError,
    changeHasError,
    errorMessage,
  } = useContext(TodosContext);

  useEffect(() => {
    const timerId = window.setTimeout(() => changeHasError(false), 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [hasError]);

  return (
    <div
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !hasError,
      })}
    >
      <button
        type="button"
        className="delete"
        aria-label="close error message"
        onClick={() => changeHasError(false)}
      />

      {errorMessage}
    </div>
  );
});
