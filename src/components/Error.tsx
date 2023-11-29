import React from 'react';
import cn from 'classnames';
import { ErrorType } from '../types/ErrorType';

type Props = {
  errorMessage: string,
  setError: (value: React.SetStateAction<ErrorType>) => void,
};

export const Error: React.FC<Props> = ({ errorMessage, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage.length === 0,
      })}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="button"
        type="button"
        className="delete"
        onClick={() => setError(ErrorType.noError)}
      />
      {errorMessage}
    </div>
  );
};
