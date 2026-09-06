import React from 'react';

type ErrorType = 'load' | 'empty' | 'add' | 'delete' | 'update' | null;

type Props = {
  error: ErrorType;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${
        error ? '' : 'hidden'
      }`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {error === 'load' && 'Unable to load todos'}
      {error === 'empty' && 'Title should not be empty'}
      {error === 'add' && 'Unable to add a todo'}
      {error === 'delete' && 'Unable to delete a todo'}
      {error === 'update' && 'Unable to update a todo'}
    </div>
  );
};
