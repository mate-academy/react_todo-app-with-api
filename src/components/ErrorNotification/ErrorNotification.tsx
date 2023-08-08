import React from 'react';
import cn from 'classnames';

interface Props {
  error: string | null;
  setError: (error: string | null) => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  const handleClick = () => {
    setError(null);
  };

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="delete-notification-btn"
        onClick={handleClick}
      />
      {error}
    </div>
  );
};
