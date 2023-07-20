import React from 'react';
import cn from 'classnames';

type Props = {
  error: string | null,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  isHidden: boolean,
};

export const Error: React.FC<Props> = ({ error, setError, isHidden }) => {
  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: isHidden },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="error-button"
        onClick={() => {
          setError(null);
        }}
      />
      {error}
    </div>
  );
};
