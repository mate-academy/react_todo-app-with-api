import React from 'react';
import cn from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

interface PropsError {
  onErrorMessage: (value: TodoStatus) => void;
  error: TodoStatus;
}

export const ErrorNotification: React.FC<PropsError> = ({
  onErrorMessage,
  error,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
      onClick={() => onErrorMessage(null)}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error}
    </div>
  );
};
