import React from 'react';
import cn from 'classnames';

interface Prop {
  errorMessage: string;
  setErrorMessage: (string: string) => void;
}

export const ErrorOfTodo: React.FC<Prop> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage !== '' },
      )}
    >
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
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
