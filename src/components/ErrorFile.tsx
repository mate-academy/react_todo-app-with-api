import React, { useMemo } from 'react';
import { Error } from '../types/Todo';

interface Props {
  errorType: Error | null;
  error: boolean;
  errorHide: () => void;
}
export const ErrorFile: React.FC<Props> = ({ errorType, error, errorHide }) => {
  const errorMessage = useMemo(() => {
    switch (errorType) {
      case 'load':
        return 'Unable to load todos';
      case 'empty':
        return 'Title should not be empty';
      case 'add':
        return 'Unable to add a todo';
      case 'delete':
        return 'Unable to delete a todo';
      case 'update':
        return 'Unable to update a todo';
      default:
        return 'Unknown error';
    }
  }, [errorType]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      {errorMessage}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={errorHide}
      />
    </div>
  );
};
