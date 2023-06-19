import React, { memo, useEffect } from 'react';
import classNames from 'classnames';

interface TodoErrorProps {
  message: string;
  onHideError: React.Dispatch<React.SetStateAction<string>>;
}

export const TodoError: React.FC<TodoErrorProps> = memo(({
  message,
  onHideError,
}) => {
  useEffect(() => {
    setTimeout(() => onHideError(''), 3000);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onHideError('')}
      >
        x
      </button>
      {message}
    </div>
  );
});
