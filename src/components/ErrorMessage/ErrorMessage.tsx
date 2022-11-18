import React from 'react';

interface Props {
  children: string;
  clearError: () => void;
}

export const ErrorMessage: React.FC<Props> = ({
  children,
  clearError,
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
        aria-label="Hide errors"
        onClick={clearError}
      />

      <p>{children}</p>
    </div>
  );
};
