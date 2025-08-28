// File: src/components/UserWarning.tsx
import React from 'react';
import cn from 'classnames';

type Props = {
  isShown: boolean;
  message: string;
  onClose: () => void;
};

export const UserWarning: React.FC<Props> = ({ isShown, message, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isShown,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {message}
    </div>
  );
};
