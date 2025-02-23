import classNames from 'classnames';
import React, { useEffect } from 'react';
interface TodoErrorsProps {
  errorMessage: string;
  setErrorMessage: (value: string) => void;
}
export const TodoErrors: React.FC<TodoErrorsProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
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
