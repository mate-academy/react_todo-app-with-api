import { FC, useEffect } from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import cn from 'classnames';

interface Props {
  errorMessage: ErrorMessages;
  onResetError: () => void;
}

export const ErrorNotification: FC<Props> = ({
  errorMessage,
  onResetError,
}) => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      onResetError();
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onResetError}
      />
      {errorMessage}
    </div>
  );
};
