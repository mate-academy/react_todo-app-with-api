import React from 'react';
import classNames from 'classnames';

interface Props {
  error: string | null;
  handleCloseError: () => void;
}

export const NotificationError: React.FC<Props> = ({
  error,
  handleCloseError,
}) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleCloseError}
        aria-label="Close Error"
      />
      {error}
    </div>
  );
};
