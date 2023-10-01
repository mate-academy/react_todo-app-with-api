import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  setErrorMessage: (errorMessage: string | null) => void;
  errorMessage: string | null;
  errorTimer: NodeJS.Timeout | null;
  setErrorTimer: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>;
};

export const ErrorNotification: React.FC<Props> = ({
  setErrorMessage,
  errorMessage,
  errorTimer,
  setErrorTimer,
}) => {
  useEffect(() => {
    if (errorTimer) {
      clearTimeout(errorTimer);
    }

    const newTimer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    setErrorTimer(newTimer);

    return () => {
      if (newTimer) {
        clearTimeout(newTimer);
      }
    };
  }, [errorMessage, setErrorTimer]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
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
        aria-label="HideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />

      {errorMessage}
    </div>
  );
};
