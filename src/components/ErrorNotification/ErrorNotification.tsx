import React from 'react';
import cn from 'classnames';

interface Props {
  error: string | null;
  setError: (error: string | null) => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};
