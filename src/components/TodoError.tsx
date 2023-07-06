import React from 'react';
import cn from 'classnames';

interface Props {
  errorMessage: string | null;
  setErrorMessage: (error: string | null) => void;
}

export const TodoError: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      <button
        type="button"
        aria-label="delete"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
