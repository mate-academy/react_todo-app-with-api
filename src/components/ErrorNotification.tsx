import React from 'react';
import cn from 'classnames';
import { ErrorMessages } from '../types/Errors';

interface Props {
  error: ErrorMessages | null;
  onClose: () => void;
}

export const Notification: React.FC<Props> = ({ error, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {error}
    </div>
  );
};
