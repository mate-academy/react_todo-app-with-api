/* eslint-disable react/display-name */
import cn from 'classnames';
import { useEffect, memo } from 'react';

interface Props {
  errorMessage: string;
  setErrorMessage: (arg: string) => void;
}

export const Error = memo(({ errorMessage, setErrorMessage }: Props) => {
  useEffect(() => {
    setTimeout(() => setErrorMessage(''), 3000);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage === '',
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
});
