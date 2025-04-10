import classNames from 'classnames';
import React from 'react';
import { Errors } from '../types/Errors';

type Props = {
  errorMessage: string;
  onClearError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClearError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage || errorMessage === Errors.None,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClearError}
      />
      {errorMessage}
    </div>
  );
};
