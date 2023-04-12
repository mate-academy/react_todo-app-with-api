import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string,
  removeError: () => void
};

export const Notification: React.FC<Props> = ({ error, removeError }) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => (removeError())}
      >
        {}
      </button>

      {error}
    </div>
  );
};
