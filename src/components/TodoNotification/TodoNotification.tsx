import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

interface Props{
  errorMessage: ErrorMessages | null;
  setErrorMessage:(error: ErrorMessages | null) => void;
}

export const TodoNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const removeErrorMessageTimer = 3000;

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(null);
    }, removeErrorMessageTimer);
  }, [errorMessage, setErrorMessage]);

  const removeErrorMessage = () => {
    setErrorMessage(null);
  };

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={removeErrorMessage}
        aria-label="Remove"
      />
      {errorMessage}
    </div>
  );
};
