/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FC, useContext, useEffect } from 'react';
import { ErrorType } from '../../types/Error';
import { TodoContext } from '../TodoProvider';

export const ErrorNotification: FC = () => {
  const { error, setError } = useContext(TodoContext);

  const handleErrorNotification = () => {
    setError(ErrorType.None);
  };

  useEffect(() => {
    const timerId = setTimeout(() => setError(ErrorType.None), 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: error === ErrorType.None,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleErrorNotification}
      />
      {error}
    </div>
  );
};
