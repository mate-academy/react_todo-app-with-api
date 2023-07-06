import React from 'react';
import cn from 'classnames';

interface Props {
  error: string | null;
  setError: (error: string | null) => void;
}

export const Error: React.FC<Props> = ({ error, setError }) => {
  const handleDismiss = () => {
    setError(null);
  };

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
      aria-label="Error Notification"
    >
      <button
        type="button"
        className="delete"
        onClick={handleDismiss}
        aria-label="Dismiss"
      />
      {error}
    </div>
  );
};
