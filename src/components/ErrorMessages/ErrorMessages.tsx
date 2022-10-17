import React from 'react';

type Props = {
  error: string,
  onClose: () => void
};

export const ErrorMessages: React.FC<Props> = ({ error, onClose }) => {
  let errorMessage = '';

  switch (error) {
    case 'load':
      errorMessage = 'Unable to load todos';
      break;

    case 'add':
      errorMessage = 'Unable to add a todo';
      break;

    case 'length':
      errorMessage = 'Title can\'t be empty';
      break;

    case 'delete':
      errorMessage = 'Unable to delete a todo';
      break;

    case 'deleteAll':
      errorMessage = 'Unable to delete all completed todo';
      break;

    case 'update':
      errorMessage = 'Unable to update a todo';
      break;

    default:
      break;
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
        onClick={onClose}
      >
        ×
      </button>
      {errorMessage}
    </div>
  );
};
