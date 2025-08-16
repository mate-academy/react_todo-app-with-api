import React from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage;
  onSaveErrorMessage: (errorMessage: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onSaveErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === '' },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSaveErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
