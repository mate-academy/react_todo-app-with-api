import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorTypes';
import React from 'react';

type Props = {
  message: ErrorType;
  setErrorMessage: (newMessage: ErrorType) => void;
};

export const ErrorMessageComponent: React.FC<Props> = ({
  message,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !message,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorType.NO_ERROR)}
      />
      {message}
    </div>
  );
};
