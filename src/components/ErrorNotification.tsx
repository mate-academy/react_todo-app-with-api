import React from 'react';
import { ErrorMessage } from '../types/ErrorMessage';
import classNames from 'classnames';

type Props = {
  errorMessage: ErrorMessage;
  handleHiddeErrorMessage: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  handleHiddeErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: errorMessage === ErrorMessage.NONE,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHiddeErrorMessage}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
