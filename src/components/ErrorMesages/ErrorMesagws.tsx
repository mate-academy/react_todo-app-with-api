import cn from 'classnames';
import React, { useEffect } from 'react';

interface Props {
  loadError: string;
  setLoadError: (message: string) => void;
}

export const ErrorMesages: React.FC<Props> = ({ loadError, setLoadError }) => {
  useEffect(() => {
    const timeout = setTimeout(() => setLoadError(''), 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [loadError, setLoadError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !loadError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setLoadError('')}
      />
      {loadError}
    </div>
  );
};
