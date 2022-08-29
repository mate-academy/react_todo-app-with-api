import React, { useContext } from 'react';
import { DispatchContext, StateContext } from './StateContext';

export const ErrorNotification: React.FC = React.memo(() => {
  const { errorMessage } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const hideError = () => {
    dispatch({ type: 'showError', peyload: '' });
  };

  return (
    <>
      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            aria-label="HideErrorButton"
            onClick={hideError}
          />
          { errorMessage }
        </div>
      )}
    </>
  );
});
