/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useContext, useEffect } from 'react';
import classNames from 'classnames';
import { GlobalContext } from '../GlobalContextProvider';

export const ErrorNotification = React.memo(() => {
  const { errorMessage, setErrorMessage } = useContext(GlobalContext);

  const hideError = useCallback(() => {
    setErrorMessage(null);
  }, [setErrorMessage]);

  useEffect(() => {
    const timerId = setTimeout(hideError, 3000);

    return () => clearTimeout(timerId);
  }, [hideError, errorMessage]);

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
        onClick={hideError}
      />
      {errorMessage}
    </div>
  );
});
