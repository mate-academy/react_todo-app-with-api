import React, { useEffect } from 'react';
import cn from 'classnames';

interface Props {
  isError: string;
  onClose: () => void;
}

export const ErrorMessage: React.FC<Props> = ({ isError, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 3000);

    return () => clearTimeout(timeout);
  }, [isError, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isError,
      })}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {isError}
    </div>
  );
};
