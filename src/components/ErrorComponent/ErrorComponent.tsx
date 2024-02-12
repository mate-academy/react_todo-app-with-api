/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { TodosContext } from '../../contexts/TodosContext';

export const ErrorComponent = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

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
        onClick={() => setErrorMessage('')}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
