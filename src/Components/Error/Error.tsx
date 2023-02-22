import classNames from 'classnames';
import React, { useEffect } from 'react';

import { ErrorMessage } from '../../types/ErrorMessage';
// import { switchError } from '../../helpers/switchError';

type Props = {
  isError: boolean,
  errorMessage: ErrorMessage;
  onErrorClose: () => void;
};

export const Error: React.FC<Props> = React.memo(({
  errorMessage,
  onErrorClose,
  isError,
}) => {
  useEffect(() => {
    const timerId = setTimeout(() => onErrorClose(), 3000);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !isError,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={onErrorClose}
        aria-label="Close error message"
      />

      {errorMessage}
    </div>
  );
});
