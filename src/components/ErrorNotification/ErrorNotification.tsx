import React from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string,
  setErrorMessage: (value: string) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage })}
    >
      <button
        aria-label="delete-todo-button"
        onClick={() => setErrorMessage('')}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
