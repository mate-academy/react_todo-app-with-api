import classNames from 'classnames';
import React from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage;
  setErrorMessage: (message: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: errorMessage === ErrorMessage.None,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.None)}
      />
      {errorMessage}
    </div>
  );
};
