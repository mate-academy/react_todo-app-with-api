import React from 'react';
import classNames from 'classnames';

interface Props {
  errorMessage: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => (
  <div
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    data-cy="ErrorNotification"
  >
    <button
      type="button"
      className="delete"
      data-cy="HideErrorButton"
      onClick={onClose}
    />

    {errorMessage}
  </div>
);
