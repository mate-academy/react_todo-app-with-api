import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { ContextTodo } from '../ContextTodo';
import { ErrorMessage } from '../../types';

export const ErrorNotification = () => {
  const { errorMessage, setErrorMessage } = useContext(ContextTodo);

  useEffect(() => {
    const timerID = setTimeout(() => {
      setErrorMessage(ErrorMessage.NothingError);
    }, 3000);

    return () => clearTimeout(timerID);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        })
      }
    >
      <button
        aria-label="delete"
        onClick={() => setErrorMessage(ErrorMessage.NothingError)}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
