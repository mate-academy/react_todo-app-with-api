import React from 'react';
import classNames from 'classnames';

interface ErrorNotificationProps {
  errorMassage: string;
  setErrorMassage: (msg: string) => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMassage,
  setErrorMassage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMassage },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => setErrorMassage('')}
    />
    {errorMassage}
  </div>
);
