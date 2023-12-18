import React from 'react';
import cn from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessages | null>>;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      >
        x
      </button>
      {errorMessage}
    </div>
  );
};
