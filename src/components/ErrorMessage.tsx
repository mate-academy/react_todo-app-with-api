/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

type ErrorMessageProps = {
  errorMessage: string,
  setErrorMessage: (error: string) => void,
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  errorMessage,
  setErrorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: !errorMessage,
      },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => {
        setErrorMessage('');
      }}
    />
    {errorMessage}
  </div>
);
