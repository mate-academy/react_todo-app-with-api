import React from 'react';
import classNames from 'classnames';

interface ErrorsProps {
  errorMessage: string;
  isHidden: boolean;
  onClose: (value: boolean) => void;
}

export const Notification: React.FC<ErrorsProps> = ({
  errorMessage,
  isHidden,
  onClose,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: isHidden },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => onClose(true)}
    />
    {errorMessage}
  </div>
);
