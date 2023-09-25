import React from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../utils/ErrorMessages';

type Props = {
  errorMessage: string,
  onErrorMessageChange: (error: ErrorMessages) => void,
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  onErrorMessageChange,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        aria-label="error"
        type="button"
        data-cy="HideErrorButton"
        className="delete"
        onClick={() => onErrorMessageChange(ErrorMessages.NoError)}
      />
      {errorMessage}
    </div>
  );
};
