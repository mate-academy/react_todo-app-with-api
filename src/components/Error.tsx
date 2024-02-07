import React from 'react';
import cn from 'classnames';

type Props = {
  error: string | null;
  setError: () => void;
}

export const Error: React.FC<Props> = (
  { error, setError = () => { } }) => {
  return (
    error ? (
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
          onClick={() => setError()}
        />
        {error}
      </div>
    ) : (
      null
    )
  )
}
