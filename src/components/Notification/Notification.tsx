import React, { useContext, useRef } from 'react';
import classNames from 'classnames';
import { Errors } from '../../types/Errors';
import { DispatchContext, StateContext } from '../../context/StateContext';

export const Notification: React.FC = () => {
  const errorMessageTimeout = useRef<number | null>(null);
  const { error } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  if (error) {
    if (errorMessageTimeout.current) {
      clearTimeout(errorMessageTimeout.current);
    }

    errorMessageTimeout.current = window.setTimeout(() => {
      dispatch({
        type: 'error',
        payload: Errors.noError,
      });
    }, 3000);
  }

  const handleClearError = () => {
    dispatch({
      type: 'error',
      payload: Errors.noError,
    });
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClearError}
      />
      {error}
    </div>
  );
};
