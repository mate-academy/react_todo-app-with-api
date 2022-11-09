import React from 'react';
import { ErrorsType } from '../types/ErrorsType';

type Props = {
  clearError: () => void,
  errors: ErrorsType[]
};

export const createError = (
  errorType: ErrorsType,
  errorCallback: (value: React.SetStateAction<ErrorsType[]>) => void,
) => {
  errorCallback(currErrors => [
    ...currErrors,
    errorType,
  ]);
  setTimeout(() => {
    errorCallback(currErrors => currErrors
      .filter(error => error !== errorType));
  }, 3000);
};

export const Errors: React.FC<Props> = ({
  clearError,
  errors,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearError}
      />

      {errors.includes(ErrorsType.Title) && (
        <p>
          Title can&apos;t be empty
        </p>
      )}

      {errors.includes(ErrorsType.Add) && (
        <p>
          Unable to add a todo
        </p>
      )}

      {errors.includes(ErrorsType.Delete) && (
        <p>
          Unable to delete a todo
        </p>
      )}

      {errors.includes(ErrorsType.Update) && (
        <p>
          Unable to update a todo
        </p>
      )}
    </div>
  );
};
