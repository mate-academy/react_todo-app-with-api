import React from 'react';
import { ErrorStatus } from '../../types/ErrorsStatus';
import classNames from 'classnames';
import { useTodosContext } from '../../context/TodoContext';

export const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodosContext();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === ErrorStatus.NoError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorStatus.NoError)}
      />
      {errorMessage}
    </div>
  );
};
