import React, { useContext } from 'react';
import classNames from 'classnames';
import {
  TodoContext, TodoUpdateContext,
} from '../ContextProviders/TodoProvider';

export const ErrorNotification: React.FC = React.memo(() => {
  const {
    error,
    hidden,
  } = useContext(TodoContext);
  const { closeErrorMessage } = useContext(TodoUpdateContext);

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
