import React from 'react';

type Props = {
  error: string;
  clearError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, clearError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light ${error ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        className="delete"
        onClick={clearError}
      />
      {error}
    </div>
  );
};
