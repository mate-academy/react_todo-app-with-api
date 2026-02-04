import classNames from 'classnames';
import { Errors } from '../types/Errors';
import React from 'react';

type ErrorProps = {
  errorMessage: Errors;
  onSetError: (error: Errors) => void;
};

export const ErrorNotification: React.FC<ErrorProps> = ({
  errorMessage = Errors.Default,
  onSetError = () => {},
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorMessage === Errors.Default },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onSetError(Errors.Default);
        }}
      />
      {errorMessage}
      <br />
    </div>
  );
};
