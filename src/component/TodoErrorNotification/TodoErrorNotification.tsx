import React from 'react';
import cls from 'classnames';
import { Errors } from '../../types/Todo';

export interface TodoErrorNotificationProps {
  getErrorMessage: string;
  isErrorHidden: () => boolean;
  setError: (type: Errors) => void;
}

export const TodoErrorNotification: React.FC<TodoErrorNotificationProps> = ({
  getErrorMessage,
  isErrorHidden,
  setError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cls('notification is-danger is-light has-text-weight-normal', {
        hidden: isErrorHidden(),
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(Errors.None)}
      />
      {getErrorMessage}
    </div>
  );
};
