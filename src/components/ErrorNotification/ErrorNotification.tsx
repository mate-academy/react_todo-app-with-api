/* eslint-disable jsx-a11y/control-has-associated-label */

import { useContext, useEffect, useRef } from 'react';

import classNames from 'classnames';

import { TodoContext } from '../../context/TodoContext';

export const ErrorNotification = () => {
  const { errorMessage, setErrorMessage } = useContext(TodoContext);

  const timeoutId = useRef(0);

  useEffect(() => {
    window.clearTimeout(timeoutId.current);

    timeoutId.current = window.setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, [errorMessage]);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
