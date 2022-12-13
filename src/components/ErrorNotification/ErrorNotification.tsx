import React from 'react';
import classNames from 'classnames';

interface Props {
  hasError: boolean;
  errorMessage: string;
  closeNotification: () => void;
}

export const ErrorNotification: React.FC<Props> = React.memo(({
  hasError,
  errorMessage,
  closeNotification,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !hasError },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      aria-label="HideErrorButton"
      onClick={closeNotification}
    />

    {errorMessage}
  </div>
));
