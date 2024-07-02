import React, { useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import {
  useErrorNotificationApi,
  useErrorNotificationErrorMessage,
} from './Context';

export const ErrorNotification = () => {
  const { errorMessage, sendError } = useErrorNotificationErrorMessage();
  const { handleErrorMessageClear } = useErrorNotificationApi();
  const errorMessageRef = useRef(errorMessage);
  const clearErrorTimeoutIdRef = useRef(0);

  const handleErrorClear = useCallback(() => {
    window.clearTimeout(clearErrorTimeoutIdRef.current);
    handleErrorMessageClear();
  }, [handleErrorMessageClear]);

  useEffect(() => {
    if (sendError) {
      clearTimeout(clearErrorTimeoutIdRef.current);
      errorMessageRef.current = errorMessage;
      clearErrorTimeoutIdRef.current = window.setTimeout(
        handleErrorClear,
        3000,
      );
    }
  }, [sendError, errorMessage, handleErrorClear]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorClear}
      />
      {errorMessageRef.current}
    </div>
  );
};
