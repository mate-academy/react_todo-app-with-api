/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { useEffect } from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorMessage: ErrorType;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorType>>
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(ErrorType.None);
    }, 3000);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorType.None)}
      />
      {errorMessage}
    </div>
  );
};
