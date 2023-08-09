import React, { useEffect } from 'react';
import cn from 'classnames';

import { ErrorMessages } from '../types/ErrorNessages';

type Props = {
  isError: ErrorMessages | null,
  setNewError: (error: ErrorMessages | null) => void,
};

export const ErrorOnPage: React.FC<Props> = ({
  isError,
  setNewError,
}) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (isError) {
      timeoutId = setTimeout(() => {
        setNewError(null);
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isError, setNewError]);

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !isError },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setNewError(null)}
        aria-label="closeBtn"
      />
      {isError}
    </div>
  );
};
