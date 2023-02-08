import React, { memo, useEffect } from 'react';
import { Errors } from '../../types/Errors';

interface Props {
  message: Errors,
  closeError: () => void,
}

export const ErrorNotification: React.FC<Props> = memo((props) => {
  const {
    message,
    closeError,
  } = props;

  useEffect(() => {
    setTimeout(closeError, 3000);
  }, [closeError]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeError}
      />
      {message}
    </div>
  );
});
