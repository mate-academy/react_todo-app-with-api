import React, { useContext } from 'react';
import { useHideError } from '../utils/hooks';
import { StateContext } from './StateContext';

export const ErrorNotification: React.FC = React.memo(() => {
  const { errorMessage } = useContext(StateContext);

  const hideError = useHideError();

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
