import React from 'react';
import classNames from 'classnames';

type Props = {
  hasError: boolean;
  hideError: () => void;
  errorMessage: string;
};

export const ErrorNotification: React.FC<Props> = ({
  hasError,
  hideError,
  errorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
      { hidden: !hasError },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={hideError}
      aria-label="deleteButton"
    />

    {errorMessage}
  </div>
);
