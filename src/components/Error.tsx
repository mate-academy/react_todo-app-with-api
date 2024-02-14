import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  error: string | null;
  setError: () => void;
};

export const Error: React.FC<Props> = (
  { error, setError = () => { } },
) => {
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (error) {
      timeout = setTimeout(() => {
        setError();
      }, 3000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !error,
        },
      )}
    >
      <span id="errorLabel" />
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-labelledby="errorLabel"
        onClick={() => setError()}
      />
      {error}
    </div>
  );
};
