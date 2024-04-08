import React, { useEffect } from 'react';
import cn from 'classnames';

import { Errors } from '../types/Errors';

interface Props {
  errorMessage: Errors | null;
  onDeleteError: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onDeleteError,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerID = setTimeout(() => onDeleteError(), 3000);

    return () => clearTimeout(timerID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onDeleteError}
      />
      {errorMessage}
    </div>
  );
};
