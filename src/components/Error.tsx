import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTodo } from '../providers/TodoProvider';

export const Error = () => {
  const { error, setError } = useTodo();
  const [isHidden, setIsHidden] = useState<boolean>(true);

  enum Errors {
    Load = 'Unable to load todos',
    Title = 'Title should not be empty',
    Add = 'Unable to add a todo',
    Delete = 'Unable to delete a todo',
    Update = 'Unable to update a todo',
  }

  useEffect(() => {
    setIsHidden(!error);

    const timerId = setTimeout(() => {
      setIsHidden(true);
      setError(null);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error, setError]);

  const handleClick = () => {
    setError(null);
    setIsHidden(true);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: isHidden,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClick}
      />
      {error && Errors[error]}
    </div>
  );
};
