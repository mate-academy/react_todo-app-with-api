/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FC, useEffect } from 'react';

interface Props {
  error: string;
  onError: (error: string) => void;
}

export const ErrorComponent: FC<Props> = React.memo(({
  error,
  onError,
}) => {
  useEffect(() => {
    const timoutId = setTimeout(() => {
      onError('');
    }, 3000);

    return clearTimeout(timoutId);
  }, [error]);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => {
          onError('');
        }}
      />
      {error}
    </div>
  );
});
