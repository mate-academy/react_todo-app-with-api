import React from 'react';

type Props = {
  error: string | null;
  onClose: () => void;
};

export const UserWarning: React.FC<Props> = ({ error, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light ${error ? '' : 'hidden'}`}
    >
      <button
        type="button"
        className="delete"
        data-cy="HideErrorButton"
        onClick={onClose}
      />

      {error}
    </div>
  );
};
