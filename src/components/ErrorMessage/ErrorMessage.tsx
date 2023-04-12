import React, { useEffect, useState } from 'react';
import { AppError } from '../../types/AppError';

interface Props {
  removeErrorMessage: () => void;
  reloadData: () => Promise<void>;
  errorType: AppError;
}

export const ErrorMessage: React.FC<Props> = ({
  removeErrorMessage,
  reloadData,
  errorType,
}) => {
  let message = '';

  switch (errorType) {
    case AppError.Get:
      message = 'Unable to load todos';
      break;
    case AppError.Post:
      message = 'Unable to add todo';
      break;
    case AppError.Patch:
      message = 'Unable to update todo';
      break;
    case AppError.Delete:
      message = 'Unable to delete todo';
      break;
    default:
      message = 'Something goes wrong';
  }

  const [timeoutLink, setTimeoutLink] = useState<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeoutLink);
    setTimeoutLink(setTimeout(() => removeErrorMessage(), 3000));
  }, []);

  const handleReloadClicked = () => {
    reloadData();
    removeErrorMessage();
  };

  return (
    <div
      className="
        notification
        is-danger
        is-light
        has-text-weight-normal"
    >
      <button
        type="button"
        className="delete"
        aria-label={' '}
        onClick={removeErrorMessage}
      />
      {message}
      <button
        type="button"
        className="button is-danger ml-6"
        onClick={handleReloadClicked}
      >
        Reload?
      </button>
    </div>
  );
};
