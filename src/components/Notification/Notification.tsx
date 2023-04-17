import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  removeErrorMessage: () => void
};

export const Notification: React.FC<Props>
= ({ errorMessage, removeErrorMessage }) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => (removeErrorMessage())}
      >
        {}
      </button>

      {errorMessage}
    </div>
  );
};
