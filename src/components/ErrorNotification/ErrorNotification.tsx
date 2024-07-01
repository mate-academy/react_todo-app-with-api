import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useErrorNotificationErrorMessage } from './Context';

let clearErrorTimeoutId = 0;

export const ErrorNotification = () => {
  const { errorMessage, sendError } = useErrorNotificationErrorMessage();
  const [errorShown, setErrorShown] = useState(false);

  const handleErrorClear = () => {
    window.clearTimeout(clearErrorTimeoutId);
    setErrorShown(false);
  };

  useEffect(() => {
    if (sendError) {
      clearTimeout(clearErrorTimeoutId);
      setErrorShown(true);
      clearErrorTimeoutId = window.setTimeout(handleErrorClear, 3000);
    }
  }, [sendError]);

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
