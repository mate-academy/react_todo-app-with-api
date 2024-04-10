import React from 'react';
import cn from 'classnames';
import { useTodos } from '../Store/Store';

const ErrorNotification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useTodos();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};

export default ErrorNotification;
