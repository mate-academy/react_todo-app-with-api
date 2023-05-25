/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect } from 'react';

interface Props {
  error: string,
  onClose: () => void,
}

export const Error: React.FC<Props> = ({
  error,
  onClose: handleCloseError,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => handleCloseError(), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleCloseError}
      />
      {error}
    </div>
  );
};
