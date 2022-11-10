import React from 'react';
import cn from 'classnames';

type Props = {
  isHidden: boolean;
  clearErrors: () => void;
  errorMessage: string;
};

export const ErrorMessage: React.FC<Props> = ({
  isHidden,
  clearErrors,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearErrors}
      >
        x
      </button>

      {errorMessage}
    </div>
  );
};
