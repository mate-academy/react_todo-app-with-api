import React from 'react';

type Props = {
  clearErrors: () => void;
  errorMessage: string;
};

export const ErrorMessage: React.FC<Props> = ({
  clearErrors,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
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
