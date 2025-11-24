import React, { useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  error: string | null;
  onError: (error: string | null) => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, onError }) => {
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        onError(null);
      }, 3000);
    }
  }, [error, onError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onError(null)}
      />
      {error}
    </div>
  );
};
