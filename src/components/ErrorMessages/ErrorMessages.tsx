import React from 'react';
import classNames from 'classnames';
import '../../App.css';

type Props = {
  error: string,
  onClose: () => void
  setError: (error: string) => void,
};

const ERROR_DURATION = 3000;

export const ErrorMessages: React.FC<Props> = ({
  error,
  onClose,
  setError,
}) => {
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

  setTimeout(() => {
    setError('');
  }, ERROR_DURATION);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: error.length === 0,
        },
      )}
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
