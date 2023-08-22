import React from 'react';
import cn from 'classnames';

type Props = {
  error: string | null;
  setError: (error: string | null) => void,
};

export const Notifications: React.FC<Props> = ({ error, setError }) => {
  const handleCloseButtonClick = () => {
    setError(null);
  };

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
    >
      <button
        type="button"
        aria-label="Close"
        className="delete"
        onClick={handleCloseButtonClick}
      />
      {error}
    </div>
  );
};
