import React, { useContext, useEffect } from 'react';
import classNames from 'classnames';
import {
  TodoContext, TodoUpdateContext,
} from '../TodoContext';

export const ErrorNotification: React.FC = React.memo(() => {
  const {
    error,
    hidden,
  } = useContext(TodoContext);
  const { closeErrorMessage } = useContext(TodoUpdateContext);

  // when data trigger error, the message will be auto removed in 3 sec
  useEffect(() => {
    setTimeout(closeErrorMessage, 3000);
  }, [hidden]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden },
      )}
    >
      <button
        aria-label="close-error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeErrorMessage}
      />
      {error}
    </div>
  );
});
