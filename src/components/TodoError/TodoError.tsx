import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string;
  onClose: () => void;
};

export const TodoError: React.FC<Props> = ({ errorMessage, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Close error notification"
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
