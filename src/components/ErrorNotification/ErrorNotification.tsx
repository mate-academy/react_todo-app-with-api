import React from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type ErrorNotificationProps = {
  errorMsg: ErrorType;
  onHideError: () => void;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMsg,
  onHideError,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: errorMsg === ErrorType.Default,
    })}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onHideError}
    />
    {errorMsg}
  </div>
);
