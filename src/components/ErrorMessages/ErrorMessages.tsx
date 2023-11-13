import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string,
  isError: boolean,
  setIsError: (value: boolean) => void,
};

export const ErrorMessages: React.FC<Props> = ({
  errorMessage,
  isError,
  setIsError,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  }, [isError, setIsError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isError,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsError(false)}
      />
      {errorMessage}
    </div>
  );
};
