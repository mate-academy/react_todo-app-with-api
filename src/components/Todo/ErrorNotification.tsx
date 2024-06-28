import React, { useEffect, useState } from 'react';
import { useTodoApi, useTodoError } from './Context';
import classNames from 'classnames';

let clearErrorTimeoutId = 0;
let clearErrorMessageTimeoutId = 0;

export const ErrorNotification = () => {
  const sentErrorMessage = useTodoError();
  const { handleErrorMessageReceived } = useTodoApi();
  const [errorMessage, setErrorMessage] = useState('');
  const [errorShown, setErrorShown] = useState(false);

  const handleErrorClear = () => {
    window.clearTimeout(clearErrorMessageTimeoutId);
    window.clearTimeout(clearErrorTimeoutId);
    setErrorShown(false);
    clearErrorMessageTimeoutId = window.setTimeout(
      () => setErrorMessage(''),
      1000,
    );
  };

  useEffect(() => {
    if (sentErrorMessage) {
      clearTimeout(clearErrorMessageTimeoutId);
      clearTimeout(clearErrorTimeoutId);
      setErrorMessage(sentErrorMessage);
      handleErrorMessageReceived();
      setErrorShown(true);
      clearErrorTimeoutId = window.setTimeout(handleErrorClear, 3000);
    }
  }, [handleErrorMessageReceived, sentErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorShown },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorClear}
      />
      {errorMessage}
    </div>
  );
};
