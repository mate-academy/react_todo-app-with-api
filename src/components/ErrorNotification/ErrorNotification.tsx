import React, { useEffect } from 'react';
import classNames from 'classnames';

import { ErrorType } from '../../types/ErrorType';
import { errorMessages } from '../../common/constants';

type Props = {
  error: ErrorType;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  error,
  onClose,
}) => {
  const errorMessage = errorMessages[error];

  useEffect(() => {
    const timerId = setInterval(onClose, 3000);

    return () => clearInterval(timerId);
  }, [onClose]);

  return (
    <>
      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: error === ErrorType.None,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={onClose}
          aria-label="Close"
        />
        {errorMessage}
      </div>
    </>
  );
});
