import React, { useMemo } from 'react';
import cn from 'classNames';

interface Props {
  errorMessage: string | null;
  onCloseNotification: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Notification: React.FC<Props> = ({
  errorMessage,
  onCloseNotification,
}) => {
  const hasError = useMemo(() => !Boolean(errorMessage), [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: hasError,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseNotification}
      />
      {errorMessage}
    </div>
  );
};
