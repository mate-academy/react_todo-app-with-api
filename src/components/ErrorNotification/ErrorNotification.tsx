import React from 'react';

export enum TextError {
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
  Title = 'Title can\'t be empty',
  Data = 'Unable to load data',
  noUser = 'No user found',
}

type Props = {
  error: TextError;
  setError: (errorMessage: TextError | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  const closeError = () => {
    setError(null);
  };

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="closeError"
        onClick={closeError}
      />

      {error}
    </div>
  );
};
