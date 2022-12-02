import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string
  onClose: () => void
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  errorMessage,
  onClose,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      aria-label="Error button"
      onClick={onClose}
    />

    {errorMessage}
  </div>
));
