/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useContext, useEffect, useRef } from 'react';
import { TodoContext } from '../../utils/TodoContext';

export const ErrorMessage: React.FC = () => {
  const {
    errorMessage,
    setErrorMessage,
    setIsVisibleErrorMessage,
  } = useContext(TodoContext);

  const message = useRef(errorMessage);

  if (errorMessage) {
    message.current = errorMessage;
  }

  useEffect(() => {
    function onTimeout() {
      setErrorMessage('');
      setTimeout(() => setIsVisibleErrorMessage(false), 1000);
    }

    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          ['notification is-danger is-light has-text-weight-normal'],
          { hidden: !errorMessage },
        )
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage('');
          setIsVisibleErrorMessage(false);
        }}
      />
      {message.current}
    </div>
  );
};
