import * as React from 'react';
import { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  error: string;
  onCloseError: () => void;
};

export const Error: React.FC<Props> = ({
  error,
  onCloseError: onCloseError,
}) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = window.setTimeout(() => {
      onCloseError();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [error, onCloseError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onCloseError()}
      />
      {error}
    </div>
  );
};
