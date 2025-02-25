import React from 'react';
import clsx from 'clsx';
import { TodoError } from '../../types/Todo';

type Props = {
  clearError: () => void;
  loadingError: TodoError | '';
};
export const ErrorNotification: React.FC<Props> = ({
  clearError,
  loadingError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={clsx(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !loadingError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearError}
      />
      {loadingError === TodoError.TodosError && (
        <>
          Unable to load todos
          <br />
        </>
      )}
      {loadingError === TodoError.QueryError && (
        <>
          Title should not be empty
          <br />
        </>
      )}
      {loadingError === TodoError.AddError && (
        <>
          Unable to add a todo
          <br />
        </>
      )}
      {loadingError === TodoError.DeleteError && (
        <>
          Unable to delete a todo
          <br />
        </>
      )}
      {loadingError === TodoError.UpdateError && 'Unable to update a todo'}
    </div>
  );
};
