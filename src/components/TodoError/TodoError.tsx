import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  error: string,
  handleError: (value: string) => void,
};

export const TodoError: React.FC<Props> = ({ error, handleError }) => {
  useEffect(() => {
    setTimeout(() => handleError(''), 3000);
  }, [error]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'has-text-weight-normal',
        'is-light',
        {
          hidden: !error,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => handleError('')}
        aria-label={error}
      />
      {error}
    </div>
  );
};
