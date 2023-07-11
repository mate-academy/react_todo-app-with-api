import React from 'react';
import cn from 'classnames';

type Props = {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>,
};

export const ErrorMessage: React.FC<Props> = ({ error, setError }) => {
  const handleDeleteErrorMessage = () => setError(null);

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
        onClick={handleDeleteErrorMessage}
        aria-label="deleteWarning"
      />
      {error}
    </div>
  );
};
