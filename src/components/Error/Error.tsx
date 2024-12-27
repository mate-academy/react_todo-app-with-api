import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  onError: (v: string) => void;
};

export const Error: React.FC<Props> = ({ errorMessage, onError }) => {
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        onError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage, onError]);

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
        onClick={() => onError('')}
      />
      {errorMessage}
    </div>
  );
};
