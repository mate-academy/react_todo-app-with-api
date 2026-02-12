import React from 'react';
import cn from 'classnames';

interface Props {
  error: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light', {
        hidden: !error,
      })}
    >
      <button data-cy="HideErrorButton" className="delete" onClick={onClose} />
      {error}
    </div>
  );
};
